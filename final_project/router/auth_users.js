const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{
  username: "user1",
  password: "pass1"},
  {
    username: "user2",
    password: "pass2"},
    {
      username: "user3",
      password: "pass3"}
];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    const userMatches = users.filter((user) => user.username === username);
    return userMatches.length > 0;
}

const authenticatedUser = (username,password)=>{ //returns boolean
  const matchingUsers = users.filter((user) => user.username === username && user.password === password);
    return matchingUsers.length > 0;
  
}
  //write code to check if username and password match the one we have in records.


//only registered users can login
regd_users.post("/login", (req,res) => {
  
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (authenticatedUser(username, password)) {
      let accessToken = jwt.sign({data:password}, "access", {expiresIn: 3600});
      req.session.authorization = {accessToken,username};
      return res.status(200).send("User successfully logged in");
  }
  else {
      return res.status(208).json({message: "Invalid username or password"});
  }
});



// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.body.review;
    const username = req.session.authorization.username;
    if (books[isbn]) {
        let book = books[isbn];
        book.reviews[username] = review;
        return res.status(200).send("Review is posted successfully");
    }
    else {
        return res.status(404).json({message: `ISBN ${isbn} not found`});
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  if (books[isbn]) {
      let book = books[isbn];
      delete book.reviews[username];
      return res.status(200).send("Review is deleted succesfully");
  }
  else {
      return res.status(404).json({message: `ISBN ${isbn} not found`});
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
