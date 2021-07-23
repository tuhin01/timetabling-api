const express = require("express");
const timetableRouter = express.Router();
const Joi = require("joi");
const auth = require("../middleware/auth");
const validateObjectId = require("../middleware/validateObjectId");
const { Lecturer } = require("../models/lecturer");
const { Section } = require("../models/section");
const { SectionDay } = require("../models/sectionDay");
const { Department } = require("../models/department");
const { Facility } = require("../models/facility");
const { Timetable, validate } = require("../models/timetable");
const { SubjectRequirement } = require("../models/subjectRequirement");
const { Subject } = require("../models/subject");
const { StudentSubjects } = require("../models/studentSubjects");

/**
 * Timetable API to get all timetables
 * API Endpoint - /api/timetables/
 *
 * Additionally if a query param 'byDepartmentId' is sent
 * then it will send all timetable for that department
 *
 * Type - GET
 */
timetableRouter.get("/", [auth, validateObjectId], async (req, res) => {
    let where = {};
    const department = req.query.byDepartmentId;
    if (department && department !== "") {
        where.department = department;
    }
    const timetables = await Timetable.find().where(where).populate("subjectRequirement").populate("subject");
    res.send(timetables);
});

/**
 * Timetable API to get specific timetable by id
 * API Endpoint example - /api/timetables/5eb5b831e0b82e02086a4815
 * Type - GET
 */
timetableRouter.get("/:id", [auth, validateObjectId], async (req, res) => {
    const timetable = await Timetable.findById(req.params.id).populate("subjectRequirement").populate("subject");
    if (!timetable) return res.status(404).send("The timetable with the given ID not found");
    res.send(timetable);
});

/**
 * Timetable API to save a timetable with sections
 * API Endpoint - /api/timetables/
 * Type - POST
 */
timetableRouter.post("/", [auth, validateObjectId], async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const department = await Department.findById(req.body.departmentId);
    if (!department) return res.status(404).send("The department with the given ID not found");

    const subjectRequirement = await SubjectRequirement.findById(req.body.subjectRequirementId);
    if (!subjectRequirement) return res.status(404).send("The subjectRequirement with the given ID not found");

    const subject = await Subject.findById(req.body.subjectId);
    if (!subject) return res.status(404).send("The subject with the given ID not found");

    if (req.body.sections.length === 0) {
        return res.status(400).send("No section was added");
    }

    const postSections = req.body.sections;

    /* Validate sections request data and create Section instances */
    const sections = validateAndCreateSections(postSections);
    if (sections.error) {
        return res.status(400).send(sections.error);
    }

    /* Check for duplicated section in DB */
    const duplicateError = await validateSectionsInDB(postSections);
    if (duplicateError) {
        return res.status(400).json({ duplicate: true, duplicateError });
    }

    const duplicateStudentError = await checkDuplicateStudentClassInSameTime(req.body.subjectId, postSections);
    if (duplicateStudentError) {
        return res.status(400).json({ duplicate: true, duplicateError: duplicateStudentError });
    }

    let timetable = new Timetable({
        department: req.body.departmentId,
        subjectRequirement: req.body.subjectRequirementId,
        subject: req.body.subjectId,
        sections,
    });

    // return res.status(404).send(timetable);
    timetable = await timetable.save();
    res.send(timetable);
});

/**
 * Timetable API to check if a student is assigned to specific day a time before adding to a new class at the same day * time
 * API Endpoint - /api/timetables/check-duplicate-class
 * Type - POST
 */
timetableRouter.post("/check-duplicate-class", [auth, validateObjectId], async (req, res) => {
    const schema = {
        subjectId: Joi.string()
            .min(3)
            .trim()
            .required()
            .error(() => {
                return {
                    message: "Subject cannot be empty.",
                };
            }),
        studentId: Joi.string()
            .min(3)
            .trim()
            .required()
            .error(() => {
                return {
                    message: "Student cannot be empty.",
                };
            }),
        sections: Joi.array()
            .required()
            .error(() => {
                return {
                    message: "Sections cannot be empty.",
                };
            }),
    };

    let { error } = Joi.validate(req.body, schema);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const subject = await Subject.findById(req.body.subjectId);
    if (!subject) return res.status(404).send("The subject with the given ID not found");

    if (req.body.sections.length === 0) {
        return res.status(400).send("No section was added");
    }

    const { sections, subjectId, studentId } = req.body;
    const duplicateStudentError = await checkDuplicateStudentClassInSameTime(subjectId, sections, studentId);
    if (duplicateStudentError) {
        return res.status(400).json({ duplicate: true, duplicateError: duplicateStudentError });
    }

    res.send("ok");
});

/**
 * Add Timetable from shared form
 * API Endpoint - /api/timetables/shared-form
 * Type - POST
 */
timetableRouter.post("/shared-form", [validateObjectId], async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const department = await Department.findById(req.body.departmentId);
    if (!department) return res.status(404).send("The department with the given ID not found");

    const subjectRequirement = await SubjectRequirement.findById(req.body.subjectRequirementId);
    if (!subjectRequirement) return res.status(404).send("The subjectRequirement with the given ID not found");

    const subject = await Subject.findById(req.body.subjectId);
    if (!subject) return res.status(404).send("The subject with the given ID not found");

    if (req.body.sections.length === 0) {
        return res.status(400).send("No section was added");
    }

    const postSections = req.body.sections;

    /* Validate sections request data and create Section instances */
    let sections = validateAndCreateSections(postSections);
    if (sections.error) {
        return res.status(400).send(sections.error);
    }

    /**
     * Create new lecturer & facility as shared from has no way to select from existing lecturer/facility
     * To separate these lecturer/facility, we need to add somekind of flag to these
     **/
    const collegeId = department.college;
    for (const section of postSections) {
        let lecturer = new Lecturer({
            name: section.lecturerOne,
            customLecturerId: section.lecturerOne,
            college: collegeId,
            autoCreated: true,
        });

        lecturer = await lecturer.save();
        section.lecturerOne = lecturer._id;

        let facility = new Facility({
            name: section.facility,
            customFacilityId: section.facility,
            college: collegeId,
            department: req.body.departmentId,
            subjectRequirement: req.body.subjectRequirementId,
            subject: req.body.subjectId,
            lecturer: lecturer._id,
            autoCreated: true,
        });

        facility = await facility.save();
        section.facility = facility._id;
    }
    /* Validate sections request data and create Section instances */
    sections = validateAndCreateSections(postSections);
    if (sections.error) {
        return res.status(400).send(sections.error);
    }

    let timetable = new Timetable({
        department: req.body.departmentId,
        subjectRequirement: req.body.subjectRequirementId,
        subject: req.body.subjectId,
        sections,
    });

    // return res.status(404).send(timetable);
    timetable = await timetable.save();
    res.send(timetable);
});

/**
 * Timetable API to update/add a section of a timetable and a timetable
 * API Endpoint - /api/timetables/5eb5b831e0b82e02086a4815
 * Type - PATCH
 */
timetableRouter.patch("/:id", [auth, validateObjectId], async (req, res) => {
    let timetable = await Timetable.findById(req.params.id);
    if (!timetable) return res.status(404).send("The timetable with the given ID not found");

    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const department = await Department.findById(req.body.departmentId);
    if (!department) return res.status(404).send("The department with the given ID not found");

    const subjectRequirement = await SubjectRequirement.findById(req.body.subjectRequirementId);
    if (!subjectRequirement) return res.status(404).send("The subject requirement with the given ID not found");

    const subject = await Subject.findById(req.body.subjectId);
    if (!subject) return res.status(404).send("The subject with the given ID not found");

    if (req.body.sections.length === 0) {
        return res.status(400).send("No section was added");
    }

    const postSections = req.body.sections;

    /* Validate sections request data and create Section instances */
    const sections = validateAndCreateSections(postSections);
    if (sections.error) {
        return res.status(400).send(sections.error);
    }

    // Backup timetable section that is already saved in DB
    const oldSections = timetable.sections;

    /**
     * Update timetable and set sections to null - !IMPORATNT
     * so that duplicate chcking on DB does not find itself as a duplicate
     * Otherwise validateSectionsInDB() will find itself as a duplicate and prevent the updates
     */
    timetable.subjectRequirement = req.body.subjectRequirementId;
    timetable.subject = req.body.subjectId;
    timetable.sections = null;
    timetable = await timetable.save();

    const duplicateError = await validateSectionsInDB(postSections);
    if (duplicateError) {
        /**
         * If duplicate is found then add the sections again to the timetable so user does not lose it
         */
        timetable.sections = oldSections;
        await timetable.save();

        /**
         * Now that we are safe and restored old sections to the timetable
         * we can send a duplicate response to the user.
         */
        return res.status(400).json({ duplicate: true, duplicateError });
    }

    const duplicateStudentError = await checkDuplicateStudentClassInSameTime(req.body.subjectId, postSections);
    if (duplicateStudentError) {
        /**
         * If duplicate is found then add the sections again to the timetable so user does not lose it
         */
        timetable.sections = oldSections;
        await timetable.save();

        /**
         * Now that we are safe and restored old sections to the timetable
         * we can send a duplicate response to the user.
         */
        return res.status(400).json({ duplicate: true, duplicateError: duplicateStudentError });
    }

    timetable.sections = sections;
    timetable = await timetable.save();
    res.send(timetable);
});

/**
 * Timetable API to delete a section
 * API Endpoint - /api/timetables/5eb5b831e0b82e02086a4815
 * Type - DELETE
 */
timetableRouter.delete("/:id", [auth, validateObjectId], async (req, res) => {
    let timetable = await Timetable.findById(req.params.id);
    if (!timetable) return res.status(404).send("The timetable with the given ID not found");

    const { dayId, sectionId } = req.body;
    const section = timetable.sections.id(sectionId);
    if (!section) return res.status(404).send("The section with the given ID not found");

    // If section has only one day then we have to delete the whole SECTION
    // else just delete the day from the section
    if (section.days.length === 1) {
        // If timetable has only one section and section has only one day then delete the whole TIMETABLE
        // else just delete the section
        if (timetable.sections.length === 1) {
            timetable = await Timetable.findByIdAndRemove(req.params.id);
            return res.send(timetable);
        } else {
            section.remove();
        }
    } else {
        const dayToDelete = section.days.id(dayId);
        if (!dayToDelete) return res.status(404).send("The day with the given ID not found");
        dayToDelete.remove();
    }

    await timetable.save();
    res.send(timetable);
});

module.exports = timetableRouter;

const validateSection = (section, index) => {
    if (!section.days || section.days.length === 0) {
        return { error: "No days was checked at Time Slot " + index };
    }
    if (!section.startTime) {
        return { error: "Start time can not be empty at Time Slot " + index };
    }
    if (!section.endTime) {
        return { error: "End time can not be empty at Time Slot " + index };
    }
    if (!section.lecturerOne) {
        return { error: "Lecturer One can not be empty at Time Slot " + index };
    }
    if (section.lecturerOne === section.lecturerTwo) {
        return { error: "Same Lecturer can not be assigned at Time Slot " + index };
    }
    if (!section.facility) {
        return { error: "Facility can not be empty at Time Slot " + index };
    }

    return { error: null };
};

const validateAndCreateSections = (postSections) => {
    let i = 1;

    for (const section of postSections) {
        const { error } = validateSection(section, i);
        if (error) {
            return { error };
        }
        i++;
    }

    return postSections.map((section) => {
        const days = section.days.map((day) => {
            return new SectionDay({ dayKey: day.dayKey });
        });

        return new Section({ ...section, days });
    });
};

const checkDuplicateStudentClassInSameTime = async (subjectId, postSections, studentId = "") => {
    let studetnsWithNewSubject;
    if (!studentId) {
        studetnsWithNewSubject = await StudentSubjects.find().where({ subject: subjectId }).populate("student");
    } else {
        studetnsWithNewSubject = [{ student: { _id: studentId } }];
    }

    for (const section of postSections) {
        const timeStart = section.startTimeKey + 50;

        for (const day of section.days) {
            let error = {
                lecturerId: "",
                facilityId: "",
                studentDuplicate: false,
                time: `${section.startTimeHour}:${section.startTimeMin} ${section.amPmSettings.startTime}`,
                day: day.dayKey,
                section,
            };

            let otherClassInThisTime = await Timetable.find({
                "sections.startTimeKey": { $lte: timeStart },
                "sections.endTimeKey": { $gte: timeStart },
                "sections.days.dayKey": day.dayKey,
            });
            if (otherClassInThisTime) {
                for (const c of otherClassInThisTime) {
                    let matchStudents = await __getMatchedStudents(c, studetnsWithNewSubject);
                    if (matchStudents.length > 0) {
                        error.studentDuplicate = true;
                        return error;
                    }
                }
            }
        }
    }
};

const __getMatchedStudents = async (c, studetnsWithNewSubject) => {
    const studentsWithExistingSubject = await StudentSubjects.find().where({ subject: c.subject }).populate("student");

    let matchStudents = [];
    studentsWithExistingSubject.forEach((existingSubject) => {
        let tempMatchStudents = studetnsWithNewSubject.filter((newSubject) => {
            return existingSubject.student._id.toString() === newSubject.student._id.toString();
        });
        matchStudents = matchStudents.concat(tempMatchStudents);
    });
    return matchStudents;
};

const validateSectionsInDB = async (postSections) => {
    for (const section of postSections) {
        const timeStart = section.startTimeKey + 50;
        const timeEnd = section.endTimeKey;

        for (const day of section.days) {
            let error = {
                departmentId: "",
                lecturerId: "",
                facilityId: "",
                time: `${section.startTimeHour}:${section.startTimeMin} ${section.amPmSettings.startTime}`,
                day: day.dayKey,
                section,
            };

            let whereStartTime = {
                "sections.startTimeKey": { $lte: timeStart },
                "sections.endTimeKey": { $gte: timeStart },
                "sections.days.dayKey": day.dayKey,
            };
            let whereEndTime = {
                "sections.startTimeKey": { $lt: timeEnd },
                "sections.endTimeKey": { $gt: timeEnd },
                "sections.days.dayKey": day.dayKey,
            };

            let duplicateFacility = await Timetable.findOne({
                "sections.facility": section.facility,
                ...whereStartTime,
            });
            if (duplicateFacility) {
                const facility = await Facility.findById(section.facility);
                if (facility.name.trim().toLowerCase() !== "online") {
                    error.facilityId = section.facility;
                    return error;
                }
            }

            let duplicateL1InL1 = await Timetable.findOne({
                "sections.lecturerOne": section.lecturerOne,
                ...whereStartTime,
            });
            let duplicateL1InL2 = await Timetable.findOne({
                "sections.lecturerTwo": section.lecturerOne,
                ...whereStartTime,
            });
            let duplicateL1InL1InEndTime = await Timetable.findOne({
                "sections.lecturerOne": section.lecturerOne,
                ...whereEndTime,
            });
            let duplicateL1InL2InEndTime = await Timetable.findOne({
                "sections.lecturerTwo": section.lecturerOne,
                ...whereEndTime,
            });

            if (duplicateL1InL1 || duplicateL1InL2 || duplicateL1InL1InEndTime || duplicateL1InL2InEndTime) {
                let duplicate = duplicateL1InL1 || duplicateL1InL2 || duplicateL1InL1InEndTime || duplicateL1InL2InEndTime;

                error.lecturerId = section.lecturerOne;
                error.departmentId = duplicate.department;
                return error;
            }

            // If lecturerTwo is set then check for duplication
            if (section.lecturerTwo) {
                let duplicateL2InL1 = await Timetable.findOne({
                    "sections.lecturerOne": section.lecturerTwo,
                    ...whereStartTime,
                });
                let duplicateL2InL2 = await Timetable.findOne({
                    "sections.lecturerTwo": section.lecturerTwo,
                    ...whereStartTime,
                });
                let duplicateL2InL1EndTime = await Timetable.findOne({
                    "sections.lecturerOne": section.lecturerTwo,
                    ...whereEndTime,
                });
                let duplicateL2InL2EndTime = await Timetable.findOne({
                    "sections.lecturerTwo": section.lecturerTwo,
                    ...whereEndTime,
                });

                if (duplicateL2InL1 || duplicateL2InL2 || duplicateL2InL1EndTime || duplicateL2InL2EndTime) {
                    let duplicate = duplicateL2InL1 || duplicateL2InL2 || duplicateL2InL1EndTime || duplicateL2InL2EndTime;

                    error.lecturerId = section.lecturerTwo;
                    error.departmentId = duplicate.department;
                    return error;
                }
            }
        }
    }
};
