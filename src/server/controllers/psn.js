var PSNjs = require('PSNjs');
var requestify = require('requestify');

function signIn(username, password) {
  var psn = new PSNjs({
    email: username,
    password: password
  });
  var promise = new Promise(function(resolve, reject) {
    psn.getUserTrophies(function(error, data) {
     if (error) {
       console.log(error);
      return reject(error);
     }
      return resolve(data);
    });
  });
  return promise
}

function sendFriendReq(toUsername, fromUserEmail, password, message='Friend request form Austin\'s awesome app') {
  var psn = new PSNjs({
    email: fromUserEmail,
    password: password
  });
  var promise = new Promise(function(resolve, reject) {
    psn.sendFriendRequest(toUsername, message, function(error, data) {
     if (error) {
       console.log(error);
      return resolve(error);
     }
      return resolve(data);
    });
  });
  return promise
}

function getGameIdFromGiantBomb(gamename) {
  return requestify.get('http://www.giantbomb.com/api/search/?api_key=90c5e38331f022cd78530100330cbfbb28e1a884&format=json&query='+ gamename +'&resources=game&limit=1').then(function(response) {
    return response.getBody().results[0]
  });
}

function getSimilar(game) {
  return requestify.get('http://www.giantbomb.com/api/game/'+game.id+'/?api_key=90c5e38331f022cd78530100330cbfbb28e1a884&format=json&field_list=genres,name,similar_games').then(function(response) {
    return response.getBody().results
  });
}

module.exports = {
  signIn, sendFriendReq, getGameIdFromGiantBomb, getSimilar
};
