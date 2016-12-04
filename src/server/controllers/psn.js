var PSNjs = require('PSNjs');
var requestify = require('requestify');

var psns = {}

function signIn(username, password) {
  if(!psns[username]) {
    var psn = new PSNjs({
      email: username,
      password: password
    });
    psn.Load("SAVED DATA", function(error) {
        if (error)
        {
            console.log("Error loading data: " + error);
            return;
        }

        // load successful!
    });

    // save example
    psn.OnSave(function(data, callback) {
        // save data
        // data will be a Base64 string
        mySaveSystem.save(data, function() {
            // all done!
            // always call the callback so the API knows you're done saving!
            //  handle your own error reporting and debugging
            callback();
        });
    });

    psns[username] = psn
  }
  // var psn = psns[username]
  var promise = new Promise(function(resolve, reject) {
    psn.getUserTrophies((error, data) => error ? reject(error) : resolve(data));
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

module.exports = {
  signIn, sendFriendReq, getGameIdFromGiantBomb, getSimilar
};
