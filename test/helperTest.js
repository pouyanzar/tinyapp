const {assert} = require('chai');
const {getUserByEmail} = require('../helpers.js');
const users = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe("getUserByEmail", () => {
  it("should return a user with valid email", () => {
    const user = getUserByEmail("user@example.com", users)
    const expectedOutput = "userRandomID";
    assert(user === expectedOutput, true);
  });
  it("should return undefined when non-existent email", () => {
    const user = getUserByEmail("user@test.com", users)
    const expectedOutput = undefined
    assert(user === expectedOutput, true);
  })
});