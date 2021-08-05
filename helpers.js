/* ===== Useful functions for server ===== */
const {urlDatabase} = require('./data');
const bcrypt = require('bcrypt');
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

const getUserByEmail = (email, database) => {
  for(let user in database) {
    if (database[user].email === email) {
      return user
    } 
  }
  return undefined;
};

const authenticate = (users, email, password) => {
  for (let user in users) {
    if (users[user].email === email) {
      if(bcrypt.compareSync(password, users[user].hashedPassword)) {
        return users[user];
      }
    }
  }
  return null
};

const urlsForUser = (id) => {
  const userUrl = {}
  for (let item in urlDatabase) {
    if (urlDatabase[item].userID === id) {
      userUrl[item] = urlDatabase[item]
    }
  }
  return userUrl;
}

module.exports= {
  generateRandomString,
  register,
  authenticate,
  getUserByEmail,
  urlsForUser
};
