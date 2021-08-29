const createError = require('http-errors');
const Follow = require('../models/follow.model')
const Tweet = require('../models/tweet.model')

module.exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    next(createError(401, 'user is not authenticated'))
  }
};

module.exports.isNotAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    next(createError(403, 'user is authenticated'))
  } else {
    next();
  }
};

module.exports.tweetAccess = (req, res, next) => {
  /*
    Verificamos que el usuario logado tiene acceso al tweet. Para ello debe darse:
      - el autor del tweet no debe tener perfil "private"
      - el autor del tweet es el propio usuario logado
      - el autor del tweet es privado pero es follower del usuario logado
  */
  Tweet.findById(req.params.id)
    .populate('author')
    .then(tweet => {
      req.tweet = tweet

      if (tweet) {
        if (tweet.author.id != req.user.id && tweet.author.private) {
          Follow.findOne({
            follower: tweet.author.id,
            followed: req.user.id
          })
            .then(follow => {
              if (follow) {
                next()
              } else {
                next(createError(403))
              }
            })
            .catch(next)
        } else {
          next()
        }
      } else {
        next(createError(404, 'tweet not found'))
      }
    })
    .catch(next)
}