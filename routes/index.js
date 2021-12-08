var express = require("express");
var router = express.Router();
//GEt Database module
const db = require("../db");
var helpers = require("../helpers");
var errors = [];

router.get("/", function (req, res, next) {
  var sqlQuery = `SELECT * FROM users`;

  //
  db.query(sqlQuery, function (err, results, fields) {
    res.render("index", {
      title: "Register - Login",
      authorised: req.session.authorised,
      fname: req.session.fname,
      users: results,
    });
  });
});

router.get("/change", function (req, res, next) {
  res.render("password", {
    title: req.session.fname + " - Change Password",
    authorised: req.session.authorised,
    fname: req.session.fname,
  });
});

router.post("/change", function (req, res, next) {
  if (!helpers.checkForm([req.body.pass, req.body.psw])) {
    errors.push("Please fill in all fields!");
    next();
    return;
  }

  if (req.body.pass !== req.body.psw) {
    errors.push("Password is not equal");
    next();
    return;
  }

  var sqlQuery = `UPDATE users SET user_pass = MD5(?) WHERE user_fname = ?`;
  var values = [req.body.pass, req.session.fname];

  db.query(sqlQuery, values, function (err, results, fields) {
    if (err) {
      errors.push(err.message);
      next();
      return;
    } else {
      req.session.authorised = true;
      res.redirect("/");
      return;
    }
  });
});

router.post("/change", function (req, res, next) {
  res.statusCode = 401;

  res.render("password", {
    title: req.session.fname + " - Change Password",
    messages: errors,
  });

  errors = [];
});

module.exports = router;
