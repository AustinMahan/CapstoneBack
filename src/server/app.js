(function() {

  'use strict';

  // *** dependencies *** //
  const express = require('express');
  var cors = require('cors')

  const appConfig = require('./config/main-config.js');
  const routeConfig = require('./config/route-config.js');
  const errorConfig = require('./config/error-config.js');

  // *** express instance *** //
  const app = express();

  // *** config *** //
  app.use(cors())
  appConfig.init(app, express);
  routeConfig.init(app);
  errorConfig.init(app);

  module.exports = app;

}());
