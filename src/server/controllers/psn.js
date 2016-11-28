var PSNjs = require('PSNjs');

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

module.exports = {
  signIn, sendFriendReq
};
