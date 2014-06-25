/*
 * cylon force driver
 * http://cylonjs.com
 *
 * Copyright (c) 2013-2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

'use strict';

var Cylon = require('cylon');

var Commands = require('./commands');

var Driver = module.exports = function Driver(opts) {
  Driver.__super__.constructor.apply(this, arguments);
  this.proxyMethods(Commands, this.connection, this);
}

Cylon.Utils.subclass(Driver, Cylon.Driver);

Driver.prototype.commands = Commands;

// Public: Starts the driver
//
// callback - params
//
// Returns null.
Driver.prototype.start = function(callback) {
  this.defineDriverEvent('connect');
  this.defineDriverEvent('authenticate');
  this.defineDriverEvent('subscribe');
  return Driver.__super__.start.apply(this, arguments);
};

// Public: Authenticate the driver.
//
// creds - params
//
// Returns null.
Driver.prototype.authenticate = function(creds) {
  return this.connection.authenticate(creds);
};

// Public: Subscribes the driver.
//
// streamPath - params
// callback - params
//
// Returns null.
Driver.prototype.subscribe = function(streamPath, callback) {
  return this.connection.subscribe(streamPath, callback);
};

// Public: Pushes a message into the message queue.
//
// apexPath - params
// method - params
// data - params
//
// Returns (apexPath, method, JSON.stringify(data)).
Driver.prototype.push = function(apexPath, method, data) {
  return this.connection.push(apexPath, method, JSON.stringify(data));
};
