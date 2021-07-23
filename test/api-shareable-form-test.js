const { User } = require("../models/user");
const { College } = require("../models/college");

//Require the dev-dependencies
const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);

const app = require("../app");
const expect = chai.expect;

// Define variables for test case.
let apiUrl = "/api/shareable-forms";
let authToken = "";
let collegeId = "";
let department = "";
let subjectRequirement = "";
let subject = "";
let testShareableFromId = "";
// A valid mongodb objectId but not a valid department id
const mongoDbObjectId = "5f54e5e2e52bd348326e7a56";
const testUser = {
    name: "Charlie",
    email: "charilie@gmail.com",
    password: "asd123asd",
};
const testShareableForm = {
    collegeId: "",
    departmentId: "",
    subjectRequirementId: "",
    subjectId: "",
};
const testSharedFromPostData = {
    ...testShareableForm,
    sections: [
        {
            startTime: "900",
            endTime: "1000",
            endTimeHour: "10",
            endTimeMin: "00",
            startTimeHour: "9",
            startTimeMin: "00",
            lecturerOne: "Tr",
            facility: "gh",
            amPmSettings: { startTime: "AM", endTime: "AM" },
            days: [{ dayKey: "sun" }],
            startTimeKey: 900,
            endTimeKey: 1000,
        },
    ],
};

describe("Shareable & Shared From API", () => {
    // Data Intialize
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
    });

    describe("POST /shareable-form", () => {
        it("should fail for data validation & return status 400", async () => {
            const authHeader = { "X-Auth-Token": authToken };
            let res = await chai.request(app).post(apiUrl).set(authHeader).send(testShareableForm);

            expect(res.status).to.equal(400);
        });

        it("should fail for departmentId & return status 404", async () => {
            const authHeader = { "X-Auth-Token": authToken };
            testShareableForm.departmentId = mongoDbObjectId;
            testShareableForm.collegeId = collegeId;
            testShareableForm.subjectRequirementId = subjectRequirement._id;
            testShareableForm.subjectId = subject._id;
            let res = await chai.request(app).post(apiUrl).set(authHeader).send(testShareableForm);

            expect(res.status).to.equal(404);
            expect(res.text).to.have.string("The department with the given ID not found");
        });

        it("should fail for collegeId & return status 404", async () => {
            const authHeader = { "X-Auth-Token": authToken };
            testShareableForm.departmentId = department._id;
            testShareableForm.collegeId = mongoDbObjectId;
            testShareableForm.subjectRequirementId = subjectRequirement._id;
            testShareableForm.subjectId = subject._id;
            let res = await chai.request(app).post(apiUrl).set(authHeader).send(testShareableForm);

            expect(res.status).to.equal(404);
            expect(res.text).to.have.string("The college with the given ID not found");
        });

        it("should fail for subjectRequirementId & return status 404", async () => {
            const authHeader = { "X-Auth-Token": authToken };
            testShareableForm.departmentId = department._id;
            testShareableForm.collegeId = collegeId;
            testShareableForm.subjectRequirementId = mongoDbObjectId;
            testShareableForm.subjectId = subject._id;
            let res = await chai.request(app).post(apiUrl).set(authHeader).send(testShareableForm);

            expect(res.status).to.equal(404);
            expect(res.text).to.have.string("The subjectRequirement with the given ID not found");
        });

        it("should fail for subjectId & return status 404", async () => {
            const authHeader = { "X-Auth-Token": authToken };
            testShareableForm.departmentId = department._id;
            testShareableForm.collegeId = collegeId;
            testShareableForm.subjectRequirementId = subjectRequirement._id;
            testShareableForm.subjectId = mongoDbObjectId;
            let res = await chai.request(app).post(apiUrl).set(authHeader).send(testShareableForm);

            expect(res.status).to.equal(404);
            expect(res.text).to.have.string("The subject with the given ID not found");
        });

        it("should return status 200", async () => {
            const authHeader = { "X-Auth-Token": authToken };
            testShareableForm.departmentId = department._id;
            testShareableForm.collegeId = collegeId;
            testShareableForm.subjectRequirementId = subjectRequirement._id;
            testShareableForm.subjectId = subject._id;
            let res = await chai.request(app).post(apiUrl).set(authHeader).send(testShareableForm);

            expect(res.status).to.equal(200);
            expect(res.body).to.be.an("object");
            expect(res.body.college).to.equal(collegeId);
            expect(res.body.department).to.deep.equal(department);
            expect(res.body.subjectRequirement).to.deep.equal(subjectRequirement);
            expect(res.body.subject).to.deep.equal(subject);

            // Assing the new shareable from id for future test case use.
            testShareableFromId = res.body._id;
        });
    });

    describe("GET /shareable-form", () => {
        it("should fail for invalid collegeId & return status 404", async () => {
            const authHeader = { "X-Auth-Token": authToken };
            const url = apiUrl + "/?byCollegeId=" + mongoDbObjectId;
            let res = await chai.request(app).get(url).set(authHeader);

            expect(res.status).to.equal(404);
            expect(res.text).to.have.string("The college with the given ID not found");
        });

        it("should return status 200", async () => {
            const authHeader = { "X-Auth-Token": authToken };
            const url = apiUrl + "/?byCollegeId=" + collegeId;
            let res = await chai.request(app).get(url).set(authHeader);

            expect(res.status).to.equal(200);
            expect(res.body).to.be.an("array");
            expect(res.body).to.have.lengthOf(1);
        });
    });

    describe("GET /shareable-form/:id", () => {
        it("should fail for invalid shareableFormId & return status 404", async () => {
            const authHeader = { "X-Auth-Token": authToken };
            const url = apiUrl + "/" + mongoDbObjectId;
            let res = await chai.request(app).get(url).set(authHeader);

            expect(res.status).to.equal(404);
            expect(res.text).to.have.string("The shareableForm with the given ID not found");
        });

        it("should return status 200", async () => {
            const authHeader = { "X-Auth-Token": authToken };
            const url = apiUrl + "/" + testShareableFromId;
            let res = await chai.request(app).get(url).set(authHeader);

            expect(res.status).to.equal(200);
            expect(res.body).to.be.an("object");
            expect(res.body.college).to.equal(collegeId);
            expect(res.body.department).to.deep.equal(department);
            expect(res.body.subjectRequirement).to.deep.equal(subjectRequirement);
            expect(res.body.subject).to.deep.equal(subject);
        });
    });

    describe("POST /shared-form", () => {
        const sharedFromApiUrl = "/api/timetables/shared-form";

        delete testSharedFromPostData.collegeId;

        it("should fail for data validation & return status 400", async () => {
            let res = await chai.request(app).post(sharedFromApiUrl).send(testSharedFromPostData);

            expect(res.status).to.equal(400);
        });

        it("should fail for departmentId & return status 404", async () => {
            testSharedFromPostData.departmentId = mongoDbObjectId;
            testSharedFromPostData.subjectRequirementId = subjectRequirement._id;
            testSharedFromPostData.subjectId = subject._id;
            let res = await chai.request(app).post(sharedFromApiUrl).send(testSharedFromPostData);

            expect(res.status).to.equal(404);
            expect(res.text).to.have.string("The department with the given ID not found");
        });

        it("should fail for subjectRequirementId & return status 404", async () => {
            testSharedFromPostData.departmentId = department._id;
            testSharedFromPostData.subjectRequirementId = mongoDbObjectId;
            testSharedFromPostData.subjectId = subject._id;
            let res = await chai.request(app).post(sharedFromApiUrl).send(testSharedFromPostData);

            expect(res.status).to.equal(404);
            expect(res.text).to.have.string("The subjectRequirement with the given ID not found");
        });

        it("should fail for subjectId & return status 404", async () => {
            testSharedFromPostData.departmentId = department._id;
            testSharedFromPostData.subjectRequirementId = subjectRequirement._id;
            testSharedFromPostData.subjectId = mongoDbObjectId;
            let res = await chai.request(app).post(sharedFromApiUrl).send(testSharedFromPostData);

            expect(res.status).to.equal(404);
            expect(res.text).to.have.string("The subject with the given ID not found");
        });

        it("should return status 200", async () => {
            testSharedFromPostData.departmentId = department._id;
            testSharedFromPostData.subjectRequirementId = subjectRequirement._id;
            testSharedFromPostData.subjectId = subject._id;
            let res = await chai.request(app).post(sharedFromApiUrl).send(testSharedFromPostData);

            expect(res.status).to.equal(200);
            expect(res.body).to.be.an("object");
            expect(res.body.department).to.equal(department._id);
            expect(res.body.subjectRequirement).to.equal(subjectRequirement._id);
            expect(res.body.subject).to.equal(subject._id);
            expect(res.body.sections[0].startTime).to.equal(testSharedFromPostData.sections[0].startTime);
            expect(res.body.sections[0].startTimeKey).to.equal(testSharedFromPostData.sections[0].startTimeKey);
            expect(res.body.sections[0].startTimeHour).to.equal(testSharedFromPostData.sections[0].startTimeHour);
            expect(res.body.sections[0].startTimeMin).to.equal(testSharedFromPostData.sections[0].startTimeMin);
            expect(res.body.sections[0].endTime).to.equal(testSharedFromPostData.sections[0].endTime);
            expect(res.body.sections[0].endTimeKey).to.equal(testSharedFromPostData.sections[0].endTimeKey);
            expect(res.body.sections[0].endTimeHour).to.equal(testSharedFromPostData.sections[0].endTimeHour);
            expect(res.body.sections[0].endTimeMin).to.equal(testSharedFromPostData.sections[0].endTimeMin);
            expect(res.body.sections[0].amPmSettings).to.deep.equal(testSharedFromPostData.sections[0].amPmSettings);
            expect(res.body.sections[0].days[0].dayKey).to.deep.equal(testSharedFromPostData.sections[0].days[0].dayKey);
        });
    });

    describe("DELETE /shareable-form/:id", () => {
        it("should fail for invalid shareableFormId & return status 404", async () => {
            const authHeader = { "X-Auth-Token": authToken };
            const url = apiUrl + "/" + mongoDbObjectId;
            let res = await chai.request(app).delete(url).set(authHeader);

            expect(res.status).to.equal(404);
            expect(res.text).to.have.string("The shareableForm with the given ID not found");
        });

        it("should return status 200", async () => {
            const authHeader = { "X-Auth-Token": authToken };
            const url = apiUrl + "/" + testShareableFromId;
            let res = await chai.request(app).delete(url).set(authHeader);

            expect(res.status).to.equal(200);
            expect(res.body._id).to.equal(testShareableFromId);
        });
    });

    after(async () => {
        await College.findByIdAndRemove(collegeId);
        await User.deleteOne({ email: testUser.email });
    });
});
