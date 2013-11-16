/*
 * cylon force commands
 * http://cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/


(function() {
  'use strict';
  var namespace;

  namespace = require('node-namespace');

  namespace("Cylon.Force", function() {
    return this.Commands = ['authenticate', 'subscribe', 'push'];
  });

}).call(this);
