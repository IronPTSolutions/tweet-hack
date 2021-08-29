const createError = require('http-errors');
const Tweet = require('../models/tweet.model')
const Like = require('../models/like.model')
const Comment = require('../models/comment.model')
const Follow = require('../models/follow.model')

module.exports.list = (req, res, next) => {
  /*
    Buscaremos todos los tweets filtrados por text (del queryparam search)
    y author (queryparam author).

    Además populamos los tweet.author para acceder al campo "private" del usuario.
    Populamos al virtual tweet.comments para obtener su listado de comentarios
    Populamos al virtual tweets.likes para obtener el nº de likes

    También buscaremos los follow para identificar aquellos usuarios que nos siguen
    (campo follow.followed == req.user.id).

    Una vez obtenidos los tweets, filtramos solo aquellos cuyo autor no sea privado
    o su autor.id esté incluido en nuestros seguidores.
  */

  const tweetCriteria = {}
  const followCriteria = { followed: req.user.id }

  if (req.query.search) {
    tweetCriteria.text = new RegExp(req.query.search, 'i')
  }

  if (req.query.author) {
    tweetCriteria.author = req.query.author
    followCriteria.follower = req.query.author
  }

  Promise.all([
    Tweet.find()
      .populate('author')
      .populate('comments')
      .populate('likes'),
    Follow.find({
      followed: req.user.id
    })
  ])
    .then(([tweets, follows]) => {
      const followerIds = follows.map(f => f.follower.toString())

      const visibleTweets = tweets.filter(tweet => (
        !tweet.author.private || followerIds.includes(tweet.author.id.toString())
      ))

      res.json(visibleTweets)
    })
    .catch(next)
}

module.exports.create = (req, res, next) => {
  const data = { text, image } = req.body

  Tweet.create({
    ...data,
    author: req.user.id
  })
    .then(tweet => res.status(201).json(tweet))
    .catch(next)
}

module.exports.delete = (req, res, next) => {
  const data = { text, image } = req.body
  
  Tweet.findOneAndDelete({
    _id: req.params.id,
    author: req.user.id
  })
    .then(tweet => {
      if (tweet) {
        res.status(204).end()
      } else {
        next(createError(404, 'tweet not found'))
      }
    })
    .catch(next)
}

module.exports.like = (req, res, next) => {
  const data = {
    tweet: req.params.id,
    user: req.user.id
  }

  Like.findOne(data)
    .then(like => {
      if (like) {
        like.delete()
          .then(() => res.status(204).end())
          .catch(next)
      } else {
        Like.create(data)
          .then(like => res.status(201).json(like))
          .catch(next)
      }
    })
    .catch(next)
}

module.exports.createComment = (req, res, next) => {
  Comment.create({
    text: req.body.text,
    user: req.user.id,
    tweet: req.params.id
  })
    .then(tweet => res.status(201).json(tweet))
    .catch(next)
}
