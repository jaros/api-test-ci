const app = require("../src/server");
const supertest = require("supertest");
const { stopDatabase } = require("../src/database");

const request = supertest(app);

afterAll(async () => {
  await stopDatabase();
});

test("fetch users", async (done) => {

  request
    .post("/graphql")
    .send({
      query: "{ users{ id, name, age} }",
    })
    .set("Accept", "application/json")
    .expect("Content-Type", /json/)
    // .expect(200)
    .end(function (err, res) {
      if (err) return done(err);
      expect(res.body).toBeInstanceOf(Object);
      const {data, errors} = res.body;
      if (errors) {
        return done(errors);
      }
      console.log(data);
      expect(data.users.length).toEqual(3);
      done();
    });
});

test("query that does not exist", async () => {
    const response = await request
      .post("/graphql")
      .send({
        query: "{ events{ id, name} }",
      })
      .set("Accept", "application/json");
  
  expect(response.status).toBe(400);
});