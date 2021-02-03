const passport = require("passport");
const User = require("../models/user.model");
const SlackStrategy = require("passport-slack").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const slack = new SlackStrategy(
  {
    clientID: process.env.SLACK_CLIENT_ID,
    clientSecret: process.env.SLACK_CLIENT_SECRET,
    callbackUrl: "/auth/slack"
  },
  (accessToken, refreshToken, profile, next) => {
    User.findOne({ "social.slack": profile.id })
      .then((user) => {
        if (user) {
          next(null, user);
        } else {
          const newUser = new User({
            name: profile.displayName,
            username: profile.user.email.split("@")[0],
            email: profile.user.email,
            avatar: profile.user.image_1024,
            password:
              profile.provider + Math.random().toString(36).substring(7),
            social: {
              slack: profile.id,
            },
          });

          newUser
            .save()
            .then((user) => {
              next(null, user);
            })
            .catch((err) => next(err));
        }
      })
      .catch((err) => next(err));
  }
);


const google = new GoogleStrategy(
  {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
}, 
(accessToken, refreshToken, profile, next) => {
  // to see the structure of the data in received response:
  console.log("Google account details:", profile);

  User.findOne({ "social.google": profile.id })
    .then(user => {
      if (user) {
        next(null, user);
      } else {
        const newUser = new User({
          name: profile.displayName,
          username: profile.displayName,
          email: profile._json.email,
          avatar: profile._json.picture,
          password:
            profile.provider + Math.random().toString(36).substring(7),
          social: {
            googleID: profile.id,
          },
        });

        newUser
        .save()
        .then((user) => {
          next(null, user);
        })
        .catch((err) => next(err));
    }
  })
  .catch((err) => next(err));
 }
);


passport.serializeUser(function(user, next) {
  next(null, user);
});

passport.deserializeUser(function(user, next) {
  next(null, user);
});

passport.use(google)
passport.use(slack)

module.exports = passport.initialize()