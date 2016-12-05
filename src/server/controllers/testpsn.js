const request = require('request');

const PS4 = 'ps4';
const PS3 = 'ps3';
const VITA = 'vita';
const BRONZE = 'bronze';
const SILVER = 'silver';
const GOLD = 'gold';
const PLATINUM = 'platinum';

const NOOP = () => undefined;

class Game {
  constructor({ id = null, title = null, platforms = [],
      progress = 0, trophies = [], avatar = null }) {
    this.id = id;
    this.title = title;
    this.platforms = platforms;
    this.progress = progress;
    this.trophies = trophies;
    this.avatar = avatar;
  }
  // Return true if game belongs to platform provided
  // @param {string} platform
  // @return {boolean}
  belongsToPlatform(platform) {
    return platform in this.platforms;
  }
}

class Trophies {
  // Scrape the public JSON feed provided by Playstation.com to find and return
  // a user object with each game and the currently completed trophies
  //  curl 'https://io.playstation.com/playstation/psn/public/trophies/?onlineId={{username}}'
  //    -H 'Origin: https://www.playstation.com' --compressed
  // @param {String} username of the PSN user
  // @param {object} options
  //   - {Number} offset to start gathering games from
  //   - {Number} limit the number of games found
  // @param {function} callback to pass completion to
  request(username, callback = NOOP) {
    const url = `https://io.playstation.com/playstation/psn/public/trophies/?onlineId=${username}`;
    const headers = {
      Origin: 'https://www.playstation.com',
    };
    return request({ url, headers }, (err, response) => {
      if (err) {
        return callback(err);
      }
      const json = JSON.parse(response.body);
      const games = json.list.map(this.parseGame);
      callback(null, games);
    });
  }
  // Convert JSON response object into Game object
  // @param {object} JSON
  // @return Game
  parseGame(game) {
    return new Game({
      id: game.gameId,
      title: game.title,
      platforms: game.platform.split(','),
      progress: game.progress,
      trophies: game.trophies,
      avatar: game.imgUrl,
    });
  }
}

module.exports = Trophies
