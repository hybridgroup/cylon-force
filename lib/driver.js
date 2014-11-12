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

var Driver = module.exports = function Driver() {
  Driver.__super__.constructor.apply(this, arguments);
  this.setupCommands(Commands);
};

Cylon.Utils.subclass(Driver, Cylon.Driver);

Driver.prototype.commands = Commands;

// Public: Starts the driver
//
// callback - params
//
// Returns null.
Driver.prototype.start = function(callback) {
  this.defineDriverEvent('push');
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
  this.adaptor.subscribe(topic, callback);
};

// Public: Pushes a message into the message queue.
//
// apexPath - params
// data - params
// callback - callback
//
// Returns callback(err, res).
Driver.prototype.push = function(apexPath, data, callback) {
  this.adaptor.push(apexPath, data, callback);
};

// Public: Creates a post request to an Apex Class
//
// apexPath - params
// data - params
// callback - callback
//
// Returns callback(err, res).
Driver.prototype.post = function(apexPath, data, callback) {
  this.adaptor.post(apexPath, data, callback);
};

// Public: Creates a get request to an Apex Class
//
// apexPath - params
// data - params
// callback - callback
//
// Returns callback(err, res).
Driver.prototype.get = function(apexPath, callback) {
  this.adaptor.get(apexPath, callback);
};

// Public: Queries salesforce for obj data
//
// apexPath - params
// data - params
// callback - callback
//
// Returns callback(err, res).
Driver.prototype.query = function(query, callback) {
  this.adaptor.query(query, callback);
};
