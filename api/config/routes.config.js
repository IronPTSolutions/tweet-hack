const express = require('express');
const router = express.Router();
const secure = require('../middlewares/secure.mid')
const users = require('../controllers/users.controller')
const tweets = require('../controllers/tweets.controller')

router.post('/users', secure.isNotAuthenticated, users.create)
router.post('/login', secure.isNotAuthenticated, users.login)
router.post('/logout', secure.isAuthenticated, users.logout)
router.get('/users/:id', secure.isAuthenticated, users.get)
router.patch('/profile', secure.isAuthenticated, users.update)
router.delete('/profile', secure.isAuthenticated, users.delete)
router.post('/users/:id/follow', secure.isAuthenticated, users.follow)

router.get('/tweets', secure.isAuthenticated, tweets.list)
router.post('/tweets', secure.isAuthenticated, tweets.create)
router.post('/tweets/:id/like', secure.isAuthenticated, secure.tweetAccess, tweets.like)
router.delete('/tweets/:id', secure.isAuthenticated, tweets.delete)
router.post('/tweets/:id/comments', secure.isAuthenticated, secure.tweetAccess, tweets.createComment)

module.exports = router;
