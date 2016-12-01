const express = require('express');
const router = express.Router();

const knex = require('../db/knex');

const psn = require("../controllers/psn")
const {checkForUser, getUserAndGame, checkGames, getUser, getUserGameFriends, getAllUsers} = require("../queries/index")

router.post('/', function(req, res, next) {
  psn.signIn(req.body.username, req.body.password)
  .then(checkForUser)
  .then(checkGames)
  .then(data => res.send(data))
  .catch(err => res.send({error: err}))
})

router.post('/:username', function(req, res, next) {
  getUser(req.params.username).then(data => {
    var user_id = data[0].id
    knex("games").update("time-plays", req.body.times).where("user_id", user_id).where("name", req.body.game.name)
    .then(() => res.send(req.body))
  })
})

router.post('/friendReq/:username', function (req, res, next) {
  psn.sendFriendReq(req.params.username, req.body.email, req.body.password)
  .then(data => res.send(data))
})

router.get('/username/:username/game/:game', function(req, res, next) {
  getUserAndGame(req.params.username, req.params.game)
  .then(data => res.send(data))
})

router.get('/similar/:gamename', function (req, res, next) {
  psn.getGameIdFromGiantBomb(req.params.gamename)
  .then(psn.getSimilar)
  .then(data => res.send(data))
})

router.get('/:username/:game', function(req, res, next) {
  getUserGameFriends(req.params.username, req.params.game)
  .then(getAllUsers)
  .then(data => res.send(data))
})


module.exports = router;
