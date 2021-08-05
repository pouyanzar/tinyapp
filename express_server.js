const express = require("express");
const {users, urlDatabase} = require('./data');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cookieSession = require('cookie-session');
const {generateRandomString, getUserByEmail, register, authenticate, urlsForUser} = require('./helpers');

const app = express();
const PORT = 8080;

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));

app.set("view engine", "ejs");

/* ====== GET Requests ======== */

app.get("/register", (req, res) => {

  const templateVars = {
    user: null,
  };
  res.render("registration", templateVars);
});

app.get("/login", (req, res) => {
  const templateVars = {
    user: null
  };
  res.render("login", templateVars);
});

app.get("/urls", (req, res) => {
  const userId = req.session.user_id;
  if (!userId) {
    return res.status(403).send("<html><body> You need <a href='/login'>login</a> to access your URLs</body></html>");
  }
  const user = users[userId]; 
  const templateVars = {
    user,
    urls: urlsForUser(userId)
  };
    res.render('urls_index', templateVars);
});
app.get("/urls/new", (req, res) => {
  const userId = req.session.user_id;
  if (!users[userId]) {
    return res.redirect("/login");
  }
  const email = users[userId].email;
  const user = getUserByEmail(email, users);
  const templateVars = {
    user,
  };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const userId = req.session.user_id;
  if(!urlDatabase[shortURL]) {
    res.status(404).send("<html><body>The requested link not found. Check your <a href='/urls'>URL list </a> again!</body></html>");
  }
  if (userId !== urlDatabase[shortURL].userID) {
    res.send("<html><body>You don't have access to that URL,Check your <a href='/urls'>URL List</a> again! Or <a href='/login'>Login</a> with correct credentials to access the URL!</body></html>");
  }
  const email = users[userId].email;
  const user = getUserByEmail(email, users);
  const templateVars = {
    shortURL,
    longURL: urlDatabase[shortURL].longURL,
    user
  };
  
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  if (!urlDatabase[shortURL]) {
    return res.send("The URL is not correct");
  }
  const userId = req.session.user_id;
  if(users[userId] !== urlDatabase[shortURL].userID) {
    return res.status(403).send("<html><body>You don't have access to that URL,Check your <a href='/urls'>URL List</a> again! Or <a href='/login'>Login</a> with correct credentials to access the URL!</body></html>");
  }
  const longURL = urlDatabase[shortURL].longURL;
  res.redirect(longURL);
});

/* =========== POST Requests ============ */

app.post("/register", (req, res) => {
  const id = generateRandomString();
  const {email, password} = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  !register(users, email, password) ?
    res.status(400).send("Email or password does not meet the requirements")
  : 
    (users[id] = {
      id,
      email,
      hashedPassword
    },
    req.session.user_id = id,
    res.redirect("/urls"));
    console.log(users)
});
app.post("/login", (req, res) => {
  const {email, password} = req.body;  
  const user = authenticate(users, email, password);
   templateVars = {
    user,
  };
  if (!user) {
    return res.send("<html><head></head><body>Email/password combination is not correct try <a href='/login'>login</a> again!</body></html>");
  } 
  req.session.user_id = user.id;
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
});

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body;
  urlDatabase[shortURL]['userID'] = req.session.user_id;
  res.redirect(`/u/${shortURL}`);
});

app.post("/urls/:id", (req, res) => {
  const newURL = req.body.newLongURL;
  urlDatabase[req.params.id].longURL = newURL;
  res.redirect("/urls");
})

app.post("/urls/:shortURL/delete", (req, res) => {
  if (!urlDatabase[req.params.shortURL]) {
    res.status(400).send("The URL not found!!!");
  }
  if (urlDatabase[req.params.shortURL].userID === req.session.user_id) {
    delete urlDatabase[req.params.shortURL];
    res.redirect("/urls");
  }
  return res.send("<html><head></head><body>You do not have permission to edit/delete this URL</body></html>");
});
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});