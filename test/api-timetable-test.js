const { User } = require("../models/user");
const { College } = require("../models/college");

//Require the dev-dependencies
const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);

const app = require("../app");
const expect = chai.expect;

// Define variables for test case.
let apiUrl = "/api/timetables";
let authToken = "";
let collegeId = "";
let department = "";
let subjectRequirement = "";
let subject = "";
let facility = "";
let lecturer = "";
// A valid mongodb objectId but not a valid department id
const mongoDbObjectId = "5f54e5e2e52bd348326e7a56";
const testUser = {
    name: "Charlie",
    email: "charilie@gmail.com",
    password: "asd123asd",
};

const testTimetablePostData = {
    departmentId: "",
    subjectRequirementId: "",
    subjectId: "",
    sections: [
        {
            facility: "",
            lecturerOne: "",
            lecturerTwo: "",
            endTimeHour: "9",
            endTimeMin: "30",
            startTimeHour: "8",
            startTimeMin: "00",
            amPmSettings: { startTime: "AM", endTime: "AM" },
            days: [{ dayKey: "sun" }],
            startTime: "800",
            endTime: "930",
            startTimeKey: 800,
            endTimeKey: 950,
        },
    ],
};

describe("Timetables API", () => {
    before(async () => {
        await chai.request(app).post("/api/users").send(testUser);
        let response = await chai.request(app).post("/api/auth").send({ email: testUser.email, password: testUser.password });
        collegeId = response.body.college;
        authToken = response.body.token;

        const authHeader = { "X-Auth-Token": authToken };
        await chai.request(app).post("/api/users/addDefaultDataForCollege").set(authHeader).send({});

        let url = "/api/departments/?byCollegeId=" + collegeId;
        let res = await chai.request(app).get(url).set(authHeader);
        department = res.body[0];

        url = "/api/subjectRequirements/?byDepartmentId=" + department._id;
        res = await chai.request(app).get(url).set(authHeader);
        subjectRequirement = res.body[0];

        let newSubject = {
            name: "Test Sub",
            customSubjectId: "CUSSUB008",
            subjectRequirementId: subjectRequirement._id,
        };
        res = await chai.request(app).post("/api/subjects/").set(authHeader).send(newSubject);
        subject = res.body;

        let newFacility = {
            name: "Test Facility",
            customFacilityId: "TF00712",
            collegeId,
        };
        res = await chai.request(app).post("/api/facilities").set(authHeader).send(newFacility);
        facility = res.body;

        let newLecturer = {
            name: "Test Lecturer",
            customLecturerId: "4340056",
            collegeId,
        };
        res = await chai.request(app).post("/api/lecturers").set(authHeader).send(newLecturer);
        lecturer = res.body;
    });

    describe("POST /timetables", () => {
        it("should fail for data validation & return status 400", async () => {
            const authHeader = { "X-Auth-Token": authToken };
            let res = await chai.request(app).post(apiUrl).set(authHeader).send(testTimetablePostData);

            expect(res.status).to.equal(400);
        });

        it("should fail for departmentId & return status 404", async () => {
            const authHeader = { "X-Auth-Token": authToken };
            testTimetablePostData.departmentId = mongoDbObjectId;
            testTimetablePostData.subjectRequirementId = subjectRequirement._id;
            testTimetablePostData.subjectId = subject._id;
            let res = await chai.request(app).post(apiUrl).set(authHeader).send(testTimetablePostData);

            expect(res.status).to.equal(404);
            expect(res.text).to.have.string("The department with the given ID not found");
        });

        it("should fail for subjectRequirementId & return status 404", async () => {
            const authHeader = { "X-Auth-Token": authToken };
            testTimetablePostData.departmentId = department._id;
            testTimetablePostData.subjectRequirementId = mongoDbObjectId;
            testTimetablePostData.subjectId = subject._id;
            let res = await chai.request(app).post(apiUrl).set(authHeader).send(testTimetablePostData);

            expect(res.status).to.equal(404);
            expect(res.text).to.have.string("The subjectRequirement with the given ID not found");
        });

        it("should fail for subjectId & return status 404", async () => {
            const authHeader = { "X-Auth-Token": authToken };
            testTimetablePostData.departmentId = department._id;
            testTimetablePostData.subjectRequirementId = subjectRequirement._id;
            testTimetablePostData.subjectId = mongoDbObjectId;
            let res = await chai.request(app).post(apiUrl).set(authHeader).send(testTimetablePostData);

            expect(res.status).to.equal(404);
            expect(res.text).to.have.string("The subject with the given ID not found");
        });

        it("should return status 200", async () => {
            const authHeader = { "X-Auth-Token": authToken };
            testTimetablePostData.departmentId = department._id;
            testTimetablePostData.subjectRequirementId = subjectRequirement._id;
            testTimetablePostData.subjectId = subject._id;
            testTimetablePostData.sections[0].facility = facility._id;
            testTimetablePostData.sections[0].lecturerOne = lecturer._id;
            let res = await chai.request(app).post(apiUrl).set(authHeader).send(testTimetablePostData);

            expect(res.status).to.equal(200);
            expect(res.body).to.be.an("object");
            expect(res.body.department).to.equal(department._id);
            expect(res.body.subjectRequirement).to.equal(subjectRequirement._id);
            expect(res.body.subject).to.equal(subject._id);
            expect(res.body.sections[0].startTime).to.equal(testTimetablePostData.sections[0].startTime);
            expect(res.body.sections[0].startTimeKey).to.equal(testTimetablePostData.sections[0].startTimeKey);
            expect(res.body.sections[0].startTimeHour).to.equal(testTimetablePostData.sections[0].startTimeHour);
            expect(res.body.sections[0].startTimeMin).to.equal(testTimetablePostData.sections[0].startTimeMin);
            expect(res.body.sections[0].endTime).to.equal(testTimetablePostData.sections[0].endTime);
            expect(res.body.sections[0].endTimeKey).to.equal(testTimetablePostData.sections[0].endTimeKey);
            expect(res.body.sections[0].endTimeHour).to.equal(testTimetablePostData.sections[0].endTimeHour);
            expect(res.body.sections[0].endTimeMin).to.equal(testTimetablePostData.sections[0].endTimeMin);
            expect(res.body.sections[0].amPmSettings).to.deep.equal(testTimetablePostData.sections[0].amPmSettings);
            expect(res.body.sections[0].days[0].dayKey).to.deep.equal(testTimetablePostData.sections[0].days[0].dayKey);
        });

        it("should fail for duplicate & return status 400", async () => {
            const authHeader = { "X-Auth-Token": authToken };
            testTimetablePostData.departmentId = department._id;
            testTimetablePostData.subjectRequirementId = subjectRequirement._id;
            testTimetablePostData.subjectId = subject._id;
            testTimetablePostData.sections[0].facility = facility._id;
            testTimetablePostData.sections[0].lecturerOne = lecturer._id;
            let res = await chai.request(app).post(apiUrl).set(authHeader).send(testTimetablePostData);

            expect(res.status).to.equal(400);
            expect(res.body).to.be.an("object");
            expect(res.body.duplicate).to.be.true;
            expect(res.body.duplicateError.section.startTime).to.equal(testTimetablePostData.sections[0].startTime);
            expect(res.body.duplicateError.section.startTimeKey).to.equal(testTimetablePostData.sections[0].startTimeKey);
            expect(res.body.duplicateError.section.startTimeHour).to.equal(testTimetablePostData.sections[0].startTimeHour);
            expect(res.body.duplicateError.section.startTimeMin).to.equal(testTimetablePostData.sections[0].startTimeMin);
            expect(res.body.duplicateError.section.endTime).to.equal(testTimetablePostData.sections[0].endTime);
            expect(res.body.duplicateError.section.endTimeKey).to.equal(testTimetablePostData.sections[0].endTimeKey);
            expect(res.body.duplicateError.section.endTimeHour).to.equal(testTimetablePostData.sections[0].endTimeHour);
            expect(res.body.duplicateError.section.endTimeMin).to.equal(testTimetablePostData.sections[0].endTimeMin);
            expect(res.body.duplicateError.section.amPmSettings).to.deep.equal(testTimetablePostData.sections[0].amPmSettings);
            expect(res.body.duplicateError.section.days[0].dayKey).to.deep.equal(testTimetablePostData.sections[0].days[0].dayKey);
        });
    });

    describe("GET /timetables", () => {
        it("should return empty timetables for invalid DepartmentId & return status 200", async () => {
            const authHeader = { "X-Auth-Token": authToken };
            const url = apiUrl + "/?byDepartmentId=" + mongoDbObjectId;
            let res = await chai.request(app).get(url).set(authHeader);

            expect(res.status).to.equal(200);
            expect(res.body).to.have.lengthOf(0);
        });

        it("should return status 200", async () => {
            const authHeader = { "X-Auth-Token": authToken };
            const url = apiUrl + "/?byDepartmentId=" + department._id;
            let res = await chai.request(app).get(url).set(authHeader);

            expect(res.status).to.equal(200);
            expect(res.body).to.be.an("array");
            expect(res.body).to.have.lengthOf(1);

            expect(res.body[0].department).to.equal(department._id);
            expect(res.body[0].subjectRequirement).to.deep.equal(subjectRequirement);
            expect(res.body[0].subject).to.deep.equal(subject);
            expect(res.body[0].sections[0].startTime).to.equal(testTimetablePostData.sections[0].startTime);
            expect(res.body[0].sections[0].startTimeKey).to.equal(testTimetablePostData.sections[0].startTimeKey);
            expect(res.body[0].sections[0].startTimeHour).to.equal(testTimetablePostData.sections[0].startTimeHour);
            expect(res.body[0].sections[0].startTimeMin).to.equal(testTimetablePostData.sections[0].startTimeMin);
            expect(res.body[0].sections[0].endTime).to.equal(testTimetablePostData.sections[0].endTime);
            expect(res.body[0].sections[0].endTimeKey).to.equal(testTimetablePostData.sections[0].endTimeKey);
            expect(res.body[0].sections[0].endTimeHour).to.equal(testTimetablePostData.sections[0].endTimeHour);
            expect(res.body[0].sections[0].endTimeMin).to.equal(testTimetablePostData.sections[0].endTimeMin);
            expect(res.body[0].sections[0].amPmSettings).to.deep.equal(testTimetablePostData.sections[0].amPmSettings);
            expect(res.body[0].sections[0].days[0].dayKey).to.deep.equal(testTimetablePostData.sections[0].days[0].dayKey);
        });
    });

    after(async () => {
        await College.findByIdAndRemove(collegeId);
        await User.deleteOne({ email: testUser.email });
    });
});
