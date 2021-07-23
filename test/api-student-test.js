const { User } = require("../models/user");
const { College } = require("../models/college");
const { Student } = require("../models/student");

//Require the dev-dependencies
const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);

const app = require("../app");
const expect = chai.expect;

// Define variables for test case.
let studentApiUrl = "/api/students";
let collegeId = "";
let authToken = "";
let studentId = "";
const testUser = {
    name: "Charlie",
    email: "charilie@gmail.com",
    password: "asd123asd",
};
const testStudent = {
    name: "Charlie Std",
    customStudentId: "BH5535TRNN",
    collegeId: "",
};

describe("Student API", () => {
    before(async () => {
        await chai.request(app).post("/api/users").send(testUser);
        let response = await chai.request(app).post("/api/auth").send({ email: testUser.email, password: testUser.password });
        collegeId = response.body.college;
        authToken = response.body.token;
    });

    describe("POST /students", () => {
        it("should return status 200", async () => {
            const authHeader = { "X-Auth-Token": authToken };

            testStudent.collegeId = collegeId;
            let res = await chai.request(app).post(studentApiUrl).set(authHeader).send(testStudent);

            expect(res.status).to.equal(200);
            expect(res.body.name).to.equal(testStudent.name);
            expect(res.body.customStudentId).to.equal(testStudent.customStudentId);
            expect(res.body).to.be.an("object");

            // Assign newly created student id to the studentId for later use.
            studentId = res.body._id;
        });
    });

    describe("GET /students/studentId", () => {
        it("should return status 200", async () => {
            const authHeader = { "X-Auth-Token": authToken };
            const url = studentApiUrl + "/" + studentId;
            let res = await chai.request(app).get(url).set(authHeader);

            expect(res.status).to.equal(200);
            expect(res.body).to.be.an("object");
            expect(res.body.name).to.equal(testStudent.name);
            expect(res.body.customStudentId).to.equal(testStudent.customStudentId);
        });
    });

    describe("POST /students/subjects", () => {
        it("should fail & return status 400", async () => {
            const authHeader = { "X-Auth-Token": authToken };

            const postData = {
                department: "",
                subjectRequirement: "",
                subject: "59101135-3",
                student: studentId,
            };
            const url = studentApiUrl + "/subjects";
            let res = await chai.request(app).post(url).set(authHeader).send(postData);

            expect(res.status).to.equal(400);
        });
    });

    describe("GET /students/subjects", () => {
        it("should return status 200", async () => {
            const authHeader = { "X-Auth-Token": authToken };

            testStudent.collegeId = collegeId;
            let res = await chai
                .request(app)
                .get(studentApiUrl + "/subjects/?studentId=" + studentId)
                .set(authHeader);

            expect(res.status).to.equal(200);
            expect(res.body).to.be.an("array");
            if (res.body.length > 0) {
                res.body.forEach((subject) => {
                    expect(subject.student).to.equal(studentId);
                });
            }
        });
    });

    describe("GET /students", () => {
        it("should return list of students", async () => {
            const authHeader = { "X-Auth-Token": authToken };

            let res = await chai
                .request(app)
                .get(studentApiUrl + "/?byCollegeId=" + collegeId)
                .set(authHeader);

            expect(res.status).to.equal(200);
            expect(res.body).to.be.an("array").that.is.not.empty;
            res.body.forEach((student) => {
                if (student.customStudentId === testStudent.customStudentId) {
                    expect(student.name).to.equal(testStudent.name);
                    expect(student.college._id).to.equal(testStudent.collegeId);
                }
            });
        });
    });

    describe("PUT /students/studentId", () => {
        it("should return status 200", async () => {
            const authHeader = { "X-Auth-Token": authToken };
            const url = studentApiUrl + "/" + studentId;
            testStudent.name = "Charlie Edit";
            let res = await chai.request(app).put(url).set(authHeader).send(testStudent);

            expect(res.status).to.equal(200);
            expect(res.body).to.be.an("object");
            expect(res.body.name).to.equal(testStudent.name);
            expect(res.body.customStudentId).to.equal(testStudent.customStudentId);
        });
    });

    describe("DELETE /students", () => {
        it("should return status 200", async () => {
            const authHeader = { "X-Auth-Token": authToken };

            let res = await chai
                .request(app)
                .delete(studentApiUrl + "/" + studentId)
                .set(authHeader);

            expect(res.status).to.equal(200);
        });
    });

    after(async () => {
        await College.findByIdAndRemove(collegeId);
        await User.deleteOne({ email: testUser.email });
    });
});
