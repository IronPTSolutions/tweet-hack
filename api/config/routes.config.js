const express = require('express');
const router = express.Router();
const secure = require('../middlewares/secure.mid')
const users = require('../controllers/users.controller')

router.post('/users', secure.isNotAuthenticated, users.create)
router.post('/login', secure.isNotAuthenticated, users.login)
router.post('/logout', secure.isAuthenticated, users.logout)
router.get('/users/:id', secure.isAuthenticated, users.get)
router.patch('/profile', secure.isAuthenticated, users.update)
router.delete('/profile', secure.isAuthenticated, users.delete)
router.post('/users/:id/follow', secure.isAuthenticated, users.follow)

/*

  TODO: (notas)

GET /tweets?user_id=xxxx?search=xxx, isAuthenticated, -> 200 [tweets]
POST /tweets { data }, isAuthenticated, -> 201 tweet
DELETE /tweets/:id, isAuthenticated, isAuthor, -> 204 No Content
POST /tweets/:id/like, isAuthenticated, visibleProfile, -> 204 No content
POST /tweets/:id/comments { data }, isAuthenticated, visibleProfile, -> 201 comment

*/

module.exports = router;
