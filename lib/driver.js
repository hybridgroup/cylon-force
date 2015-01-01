/*
 * cylon force driver
 * http://cylonjs.com
 *
 * Copyright (c) 2013-2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var Cylon = require("cylon");

var Commands = require("./commands");

var Driver = module.exports = function Driver() {
  Driver.__super__.constructor.apply(this, arguments);
  this.setupCommands(Commands);
};

Cylon.Utils.subclass(Driver, Cylon.Driver);

Driver.prototype.commands = Commands;

/**
 * Starts the driver
 *
 * @param {Function} callback to be triggered when started
 * @return {null}
 */
Driver.prototype.start = function(callback) {
  this.defineDriverEvent("push");
  this.defineDriverEvent("subscribe");
  callback();
};

/**
 * Stops the driver
 *
 * @param {Function} callback to be triggered when halted
 * @return {null}
 */
Driver.prototype.halt = function(callback) {
  callback();
};

/**
 * Subscribes to a topic in Salesforce
 *
 * @param {String} topic name of the topic to subscribe to
 * @param {Function} callback triggered when new data is received for the topic
 * @return {null}
 * @publish
 */
Driver.prototype.subscribe = function(topic, callback) {
  this.connection.subscribe(topic, callback);
};

/**
 * Posts data to a Salesforce Apex Class
 *
 * @param {String} apexPath SF apex path to send data to
 * @param {Object} data information to store in Salesforce
 * @param {Function} callback triggered when data is sent to SF
 * @return {null}
 * @publish
 */
Driver.prototype.post = function(apexPath, data, callback) {
  this.connection.post(apexPath, data, callback);
};

/**
 * Alias to `#post`
 *
 * @see @post
 */
Driver.prototype.push = function(apexPath, data, callback) {
  this.connection.push(apexPath, data, callback);
};

/**
 * Gets data from a Salesforce Apex Class
 *
 * @param {String} apexPath SF apex path to get data from
 * @param {Function} callback triggered when new data is received
 * @return {null}
 * @publish
 */
Driver.prototype.get = function(apexPath, callback) {
  this.connection.get(apexPath, callback);
};

/**
 * Queries data from Salesforce
 *
 * @param {String} query SF query to look for data with
 * @param {Function} callback triggered when new data is received
 * @return {null}
 * @publish
 */
Driver.prototype.query = function(query, callback) {
  this.connection.query(query, callback);
};
