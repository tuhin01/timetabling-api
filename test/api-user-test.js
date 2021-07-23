const { User } = require("../models/user");
const { College } = require("../models/college");

//Require the dev-dependencies
const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);

const app = require("../app");
const expect = chai.expect;

let collegeId = "";
let authToken = "";
const testUser = {
  name: "Charlie",
  email: "charilie@gmail.com",
  password: "asd123asd",
};

const testInviteUser = {
  collegeId: "",
  name: `Charlie Invite`,
  email: "charilie_invite@gmail.com",
  password: "asd123asd",
};

describe("User API", () => {
  describe("POST /api/users/", () => {
    it("should create a user", async () => {
      let res = await chai.request(app).post("/api/users").send(testUser);

      expect(res.status).to.equal(200);
      expect(res.body.name).to.equal(testUser.name);
      expect(res.body.email).to.equal(testUser.email);
      expect(res.body).to.be.an("object");

      collegeId = res.body.college;
      authToken = res.body.token;
    });
  });

  describe("POST /api/users/", () => {
    it("should fail to create a user", async () => {
      let res = await chai
        .request(app)
        .post("/api/users")
        .send({ ...testUser, name: "" });

      expect(res.status).to.equal(400);
    });
  });

  describe("POST /api/auth/", () => {
    it("should authenticate the user", async () => {
      let res = await chai.request(app).post("/api/auth").send({ email: testUser.email, password: testUser.password });

      expect(res.status).to.equal(200);
      expect(res.body.name).to.equal(testUser.name);
      expect(res.body.email).to.equal(testUser.email);
      expect(res.body).to.be.an("object");

      collegeId = res.body.college;
      authToken = res.body.token;
    });
  });

  describe("GET /api/users/me", () => {
    it("should get logged in user info", async () => {
      const authHeader = { "X-Auth-Token": authToken };

      let res = await chai.request(app).get("/api/users/me").set(authHeader);

      expect(res.status).to.equal(200);
      expect(res.body.name).to.equal(testUser.name);
      expect(res.body.email).to.equal(testUser.email);
      expect(res.body.college).to.equal(collegeId);
      expect(res.body).to.be.an("object");
    });
  });

  describe("PUT /api/users/me", () => {
    it("should update user info", async () => {
      const authHeader = { "X-Auth-Token": authToken };

      let update = { name: "Charlie Last", ...testUser };
      let res = await chai.request(app).put("/api/users/me").set(authHeader).send(update);

      expect(res.status).to.equal(200);
      expect(res.body.name).to.equal(update.name);
      expect(res.body.email).to.equal(testUser.email);
      expect(res.body.college).to.equal(collegeId);
      expect(res.body).to.be.an("object");
    });
  });

  describe("POST /api/users/invite", () => {
    it("should invite a user", async () => {
      const authHeader = { "X-Auth-Token": authToken };

      testInviteUser.collegeId = collegeId;
      let res = await chai.request(app).post("/api/users/invite").set(authHeader).send(testInviteUser);

      expect(res.status).to.equal(200);
      expect(res.body.name).to.equal(testInviteUser.name);
      expect(res.body.email).to.equal(testInviteUser.email);
      expect(res.body.college).to.equal(collegeId);
      expect(res.body).to.be.an("object");
      expect(res.body.settings).to.be.an("object").that.has.property("clockType");
    });
  });

  describe("PUT /api/users/updateSettings", () => {
    it("should update timetable settings for the user", async () => {
      const authHeader = { "X-Auth-Token": authToken };

      const settings = {
        clockType: 24,
        firstDayOfWeek: "mon",
        timeIncrement: 30,
      };
      let res = await chai.request(app).put("/api/users/updateSettings").set(authHeader).send(settings);

      expect(res.status).to.equal(200);
      expect(res.body.name).to.equal(testUser.name);
      expect(res.body.email).to.equal(testUser.email);
      expect(res.body.college).to.equal(collegeId);
      expect(res.body).to.be.an("object");
      expect(res.body.settings).to.be.an("object").that.has.property("clockType");
      expect(res.body.settings.clockType).to.equal(settings.clockType);
      expect(res.body.settings.firstDayOfWeek).to.equal(settings.firstDayOfWeek);
      expect(res.body.settings.timeIncrement).to.equal(settings.timeIncrement);
    });
  });

  describe("POST /api/users/addDefaultDataForCollege", () => {
    it("should add default departments & subject requirements", async () => {
      const authHeader = { "X-Auth-Token": authToken };
      let res = await chai.request(app).post("/api/users/addDefaultDataForCollege").set(authHeader).send({});

      expect(res.status).to.equal(200);
      expect(res.body).to.be.empty;
    });
  });

  after(async () => {
    await College.findByIdAndRemove(collegeId);
    await User.deleteOne({ email: testUser.email });
    await User.deleteOne({ email: testInviteUser.email });
  });
});
