const createError = require('http-errors');
const Tweet = require('../models/tweet.model');


module.exports.create = (req, res, next) => {
  const data = { 
      text: req.body.text,
      image: req.file.path,
      author: req.user,
    };
  
  Tweet.create(data)
    .then(tweet => res.status(201).json(tweet))
    .catch(next)
}

module.exports.list = (req, res, next) => {
    Tweet.find()
        .then(tweets => res.status(200).json(tweets))
        .catch(next)
}

module.exports.delete = (req, res, next) => {
    Tweet.findById(req.params.id)
        .then((tweet) => {
            if(tweet.author == req.user.id) {
                return tweet.delete()
                    .then(() => res.status(204).end())
            } else {
                res.status(403).end()
            }
        })
        .catch(next)
}