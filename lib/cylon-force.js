/*
 * cylon-force
 * http://cylonjs.com
 *
 * Copyright (c) 2013-2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var namespace = require('node-namespace');

require('cylon');
require('./commands');
require('./adaptor');
require('./driver');

module.exports = {
  adaptor: function(opts) {
    return new Cylon.Adaptors.Force(opts);
  },

  driver: function(opts) {
    return new Cylon.Drivers.Force(opts);
  },

  register: function(robot) {
    Logger.info("Registering Force adaptor for " + robot.name);
    robot.registerAdaptor('cylon-force', 'force');

    Logger.info("Registering Force driver for " + robot.name);
    return robot.registerDriver('cylon-force', 'force');
  }
};
