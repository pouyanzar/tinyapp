/* ===== Useful functions for server ===== */

const generateRandomString = () => {
  return Math.random().toString(36).substring(2,8);
};

const register = (users,email, password) => {
  if (email === "" || password === "") {
    return null;
  }
  for (let user in users) {
    if (users[user].email === email) {
      return null;
    }
  }
  return true;
};

const findUser = (users, userId) => {
  if (users[userId]) {
    return users[userId]
  } 
  return null;
};

const authenticate = (users, email, password) => {
  for (let user in users) {
    if (users[user].email === email) {
      if(users[user].password === password)
      return users[user];
    }
  }
  return null
};

module.exports= {
  generateRandomString,
  register,
  authenticate,
  findUser
};