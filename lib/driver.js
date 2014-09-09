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
  this.setupCommands(Commands);
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
  this.defineDriverEvent('subscribe');
  callback();
};

Driver.prototype.halt = function(callback) {
  callback();
};

// Public: Subscribes the driver.
//
// topic - params
// callback - params
//
// Returns null.
Driver.prototype.subscribe = function(topic, callback) {
  return this.connection.subscribe(topic, callback);
};

// Public: Pushes a message into the message queue.
//
// apexPath - params
// data - params
//
// Returns (apexPath, data).
Driver.prototype.push = function(apexPath, data) {
  return this.connection.push(apexPath, data);
};
