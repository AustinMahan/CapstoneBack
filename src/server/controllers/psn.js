var PSNjs = require('./testpsn.js');
var requestify = require('requestify');

function signIn(username, password) {
  var psn3 = new PSNjs()
  var promise = new Promise(function(resolve, reject) {
    psn3.request(username, (err, games) => err ? reject(error) : resolve(games));
  });
  return promise
}

function sendFriendReq(toUsername, fromUserEmail, message='Friend request from Austin\'s awesome app') {
  // var psn = psns[fromUserEmail]
  // var psn = new PSNjs({
  //   email: username,
  //   password: password,
  //   authfile: ".psnAuth"
  // });
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

function formatData(data, username) {
  var output = {}
  output.trophyTitles = data.map(el => {
    var out = {
      trophyTitleName: el.title,
      trophyTitleIconUrl: el.avatar,
      progress: el.progress,
      platforms: el.platforms
    }
    out.fromUser = {}
    out.fromUser.onlineId = username
    out.fromUser.progress = el.progress
    return out
  })
  return output
}

// var psn3 = new PSNjs()
// psn3.request("ViperDriver-21", (err, games) => console.log(formatData(games).trophyTitles));

module.exports = {
  signIn, sendFriendReq, getGameIdFromGiantBomb, getSimilar, formatData
};
