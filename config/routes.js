const passport = require("passport");
const express = require('express');
const router = express.Router();
const multer = require('multer');
const tweetsController = require('../controllers/tweets.controller')
const usersController = require('../controllers/users.controller')
const sessionMiddleware = require('../middlewares/session.middleware')
const uploads = require('../config/multer.config');



router.get('/auth/slack', sessionMiddleware.isNotAuthenticated, usersController.doSlackLogin);
router.get('/login', sessionMiddleware.isNotAuthenticated, usersController.login);
router.post('/login', sessionMiddleware.isNotAuthenticated, usersController.doLogin);
router.get('/signup', sessionMiddleware.isNotAuthenticated, usersController.signup);
router.post('/users', sessionMiddleware.isNotAuthenticated, uploads.single('avatar'), usersController.createUser);
router.get('/activate/:token', sessionMiddleware.isNotAuthenticated, usersController.activateUser);
router.post('/logout', sessionMiddleware.isAuthenticated, usersController.logout);
router.get('/tweets', sessionMiddleware.isAuthenticated, tweetsController.list);
router.get('/tweets/locations', sessionMiddleware.isAuthenticated, tweetsController.locations);
router.post('/tweets/:id/like', sessionMiddleware.isAuthenticated, tweetsController.like)
router.get('/map', sessionMiddleware.isAuthenticated, tweetsController.map)



router.get("/", (req, res) => {
  res.redirect("/tweets");
});

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email"
    ]
  })
);

router.get(
  "/auth/google/callback", sessionMiddleware.isNotAuthenticated, usersController.doGoogleLogin,
  passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/" // here you would redirect to the login page using traditional login approach
  })
);



module.exports = router;
