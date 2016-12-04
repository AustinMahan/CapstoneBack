var PSNjs = require('PSNjs');
var requestify = require('requestify');

var psns = {}

function signIn(username, password) {
  if(!psns[username]) {
    var psn = new PSNjs({
      email: username,
      password: password,
      authfile: ".psnAuth"
    });
    psns[username] = psn
  }
  var psn = psns[username]
  var promise = new Promise(function(resolve, reject) {
    psn.getUserTrophies((error, data) => error ? reject(error) : resolve(data));
  });
  return promise
}

function sendFriendReq(toUsername, fromUserEmail, message='Friend request from Austin\'s awesome app') {
  var psn = psns[fromUserEmail]
  var promise = new Promise(function(resolve, reject) {
    psn.sendFriendRequest(toUsername, message, (error, data) => error ? resolve(error) : resolve(data));
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
