const knex = require('../db/knex');

function checkForUser(data) {
  if (data.trophyTitles) {
    findOrAddUser(data.trophyTitles[0].fromUser.onlineId, data.trophyTitles)
    return data.trophyTitles.filter(game => game.fromUser.progress)
  }
  return {"error":data}
}

function findOrAddUser(username, games) {
  return getWhere("users", "username", username)
  .then(data => {
    if (data.length) {
      return username
    } else {
      return insertUser("users", username)
      .then(() => {
        addGames(username, games)
      })
    }
  })
}

function addGames(username, games) {
  getWhere("users", "username", username)
  .then(data => {
    var id = data[0].id
    var promise = games.filter(game => game.fromUser.progress).map(game => insertGame(game, id))
    return Promise.all(promise).then(idk => idk)
  })
}

function insertGame(game, id) {
  return knex("games").insert({"user_id": id, "name": game.trophyTitleName, "time-plays":null})
}

function insertUser(table, val) {
  return knex(table).insert({"username": val})
}

function getWhere(table, col, val) {
  return knex(table).where(col, val)
}

function getUserAndGame(username, gamename) {
  return getWhere("users", "username", username)
  .then(data => {
    return knex("games").where("name", gamename).where("user_id", data[0].id)
  })
}

function getGamesFromUser(data) {
  return getWhere("users", "username", data[0].fromUser.onlineId)
  .then(data => {
    var id = data[0].id
    return getWhere("games", "user_id", id)
  })
}

function checkGames(data) {
  return getGamesFromUser(data)
  .then(games => {
    var dbGames = games
    if (dbGames.length != data.length) {
      return addNewGameToUser(data[0].fromUser.onlineId, dbGames, data)
      .then(() => data)
    } else {
      return data
    }
  })
}

function addNewGameToUser(username, dbGames, trophyGames) {
  return getWhere("users", "username", username)
  .then(data => {
    var promise = findDifference(dbGames, trophyGames).map(game => {
      return knex("games").insert({"user_id": data[0].id, "name": game.trophyTitleName, "time-plays":null})
    })
    return Promise.all(promise)
  })

  // knex("games").insert()
}

function findDifference(dbGames, trophyGames) {
  return trophyGames.filter(game => dbGames.filter(dbGame => dbGame.name == game.trophyTitleName).length == 0)
}

function getUser(username) {
  return getWhere("users", "username", username)
}

function getUserGameFriends(username, gamename) {
  return getUser(username).then(user => {
    return knex("games").where("user_id", user[0].id).where("name", gamename).then(userGame => {
      return getWhere("games", "name", gamename).then(data => {
        return similar(userGame[0], data)
      })
    })
  })
}

function similar(user, arr) {
  var userTime = splitStr(user["time-plays"])
  var maxNum = timePlays(userTime)
  return arr.map(curUser => {
    if (!curUser["time-plays"]) return null
    var thisTime = splitStr(curUser["time-plays"])
    return compare(userTime, thisTime) >= maxNum * .5 && curUser.user_id != user.user_id ? curUser : null
  }).filter(el => el)
}

function timePlays(userTime) {
  return userTime.reduce((a, b) => a + parseInt(b.reduce((c,d) => parseInt(c) + parseInt(d))), 0)
}

function splitStr(str) {
  return str.split('-').map(strs => strs.split(''))
}

function compare(arr1, arr2) {
  var similarity = 0;
  arr1.forEach((row, i) => {
    row.forEach((el, j) => {
      if (el == arr2[i][j] && el == 1) similarity++
    })
  })
  return similarity
}

function getAllUsers(data) {
  var promise = data.map(el => {
    return getWhere("users", "id", el.user_id).then(user => el.username = user[0].username)
  })

  return Promise.all(promise).then(() => data)
}

module.exports = {
  checkForUser, getUserAndGame, checkGames, getUser, getUserGameFriends, getAllUsers
}
