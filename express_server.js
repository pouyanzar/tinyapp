const express = require("express");
const app = express();
const PORT = 8080;
const {generateRandomString, findUser, register, authenticate} = require('./functions');
const {users, urlDatabase} = require('./data');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

/* ====== GET Requests ======== */

app.get("/register", (req, res) => {
  const templateVars = {
    user: findUser(users, req.cookies["user_id"]),
    urls: urlDatabase
  };
  res.render("registration", templateVars);
});

app.get("/login", (req, res) => {
  const templateVars = {
    user: findUser(users, req.cookies["user_id"]),
    urls: urlDatabase
  };
  res.render("login", templateVars);
});

app.get("/urls", (req, res) => {
  const templateVars = {
    user: findUser(users, req.cookies["user_id"]),
    urls: urlDatabase
  };
  res.render('urls_index', templateVars);
});
app.get("/urls/new", (req, res) => {
  const templateVars = {
    user: findUser(users, req.cookies["user_id"]),
    urls: urlDatabase
  };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], user: findUser(users, req.cookies["user_id"])};

  res.render("urls_show", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  res.redirect(longURL);
});

/* =========== POST Requests ============ */

app.post("/register", (req, res) => {
  const id = generateRandomString();
  const {email, password} = req.body;
  !register(users, email, password) ?
    res.status(400).send("Email or password does not meet the requirements")
  : 
    (users[id] = {
      id,
      email,
      password
    },
    res.cookie("user_id", id),
    res.redirect("/urls"))
});
app.post("/login", (req, res) => {
  
   templateVars = {
    user: findUser(users, req.cookies["user_id"]),
    urls: urlDatabase
  };
  const {email, password} = req.body;
  const user = authenticate(users, email, password);
  if (user) {
    res.cookie("user_id", user.id);
    return res.redirect("/urls");
  } 
  res.send("Email/password combination is not correct");
});

app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.redirect("/urls");
});

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/u/${shortURL}`);
});

app.post("/urls/:id", (req, res) => {
  const newURL = req.body.newLongURL;
  urlDatabase[req.params.id] = newURL;
  res.redirect("/urls");
})

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});