(function (routeConfig) {

  'use strict';

  routeConfig.init = function (app) {

    // *** routes *** //
    const psn = require('../routes/psn');

    // *** register routes *** //
    app.use('/psn', psn);

  };

})(module.exports);
