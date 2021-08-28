const createError = require('http-errors');
const User = require('../models/user.model');
const Follow = require('../models/follow.model');
const passport = require('passport');

module.exports.create = (req, res, next) => {
  const data = { name, username, bio, private, avatar, password } = req.body

  User.create(req.body)
    .then(user => res.status(201).json(user))
    .catch(next)
}

module.exports.get = (req, res, next) => {
  User.findById(req.params.id)
    .then(user => {
      if (user) {
        if (user.private && user.id != req.user.id) {
          Follow.findOne({
            follower: req.params.id,
            followed: req.user.id
          })
            .then(follow => {
              if (follow) {
                res.json(user)
              } else {
                next(createError(403))
              }
            })
            .catch(next)
        } else {
          res.json(user)
        }
      } else {
        next(createError(404, 'user not found'))
      }
    })
    .catch(next)
}

module.exports.delete = (req, res, next) => {
  User.findByIdAndDelete(req.user.id)
    .then(user => {
      if (user) {
        res.status(204).end()
      } else {
        next(createError(404, 'user not found'))
      }
    })
    .catch(next)
}

module.exports.follow = (req, res, next) => {
  if (req.params.id == req.user.id) {
    return next(createError(403))
  }

  const data = {
    follower: req.user.id,
    followed: req.params.id
  }

  Follow.findOne(data)
    .then(follow => {
      if (follow) {
        return follow.delete()
          .then(() => res.status(204).end())
      } else {
        return Follow.create(data)
          .then(follow => res.status(201).json(follow))
      }
    })
    .catch(next)
}

module.exports.update = (req, res, next) => {
  const data = { name, username, bio, private, avatar, password } = req.body

  Object.assign(req.user, data)

  req.user.save()
    .then(user => res.json(user))
    .catch(next)
}

module.exports.logout = (req, res, next) => {
  req.logout();
  res.status(204).end()
}

module.exports.login = (req, res, next) => {
  passport.authenticate('local-auth', (error, user, validations) => {
    if (error) {
      next(error);
    } else if (!user) {
      next(createError(400, { errors: validations }))
    } else {
      req.login(user, error => {
        if (error) next(error)
        else res.json(user)
      })
    }
  })(req, res, next);
};
