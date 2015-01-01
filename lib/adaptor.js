/*
 * cylon salesforce adaptor
 * http://cylonjs.com
 *
 * Copyright (c) 2013-2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var Cylon = require("cylon"),
    JSForce = require("jsforce");

var Commands = require("./commands");

var Adaptor = module.exports = function Adaptor(opts) {
  Adaptor.__super__.constructor.apply(this, arguments);
  opts = opts || {};

  this.oauth2Creds = opts.orgCreds || opts.oauth2;

  this.connCreds = {
    oauth2: this.oauth2Creds,
    serverUrl: opts.serverUrl,
    sessionId: opts.sessionId,
    instanceUrl: opts.instanceUrl,
    accessToken: opts.accessToken,
    refreshToken: opts.refreshToken
  };

  this.sfuser = opts.sfuser;
  this.sfpass = opts.sfpass;

  this.sfCon = null;
  this.userInfo = null;
};

Cylon.Utils.subclass(Adaptor, Cylon.Adaptor);

Adaptor.prototype.commands = Commands;

/**
 * Connects to Salesforce
 *
 * @param {Function} callback to be triggered when connected
 * @return {null}
 */
Adaptor.prototype.connect = function(callback) {
  this.sfCon = new JSForce.Connection(this.connCreds);

  this.sfCon.login(this.sfuser, this.sfpass, function(err, userInfo) {
    if (!!err) {
      throw new Error(err);
    }

    this.userInfo = userInfo;

    callback();
  }.bind(this));
};

/**
 * Disconnects from Salesforce
 *
 * @param {Function} callback to be triggered when disconnected
 * @return {null}
 */
Adaptor.prototype.disconnect = function(callback) {
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
Adaptor.prototype.subscribe = function(topic, callback) {
  if (!!this.userInfo) {
    var adCallback = function(data) {
      this.emit("push", data);

      if ("function" === typeof(callback)) {
        callback(null, data);
      }
    }.bind(this);

    this.sfCon.streaming.topic(topic).subscribe(adCallback);
  }

  return !!this.userInfo;
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
Adaptor.prototype.post = function(apexPath, data, callback) {
  if (!!this.userInfo) {
    this.sfCon.apex.post(apexPath, data, function(err, res) {
      if ("function" === typeof(callback)) {
        callback(err, res);
      }
    }.bind(this));
  }

  return !!this.userInfo;
};

/**
 * Alias to `#post`
 *
 * @see @post
 */
Adaptor.prototype.push = Adaptor.prototype.post;

/**
 * Gets data from a Salesforce Apex Class
 *
 * @param {String} apexPath SF apex path to get data from
 * @param {Function} callback triggered when new data is received
 * @return {null}
 * @publish
 */
Adaptor.prototype.get = function(apexPath, callback) {
  if (!!this.userInfo) {
    this.sfCon.apex.get(apexPath, function(err, res) {
      if ("function" === typeof(callback)) {
        callback(err, res);
      }
    }.bind(this));
  }

  return !!this.userInfo;
};

/**
 * Queries data from Salesforce
 *
 * @param {String} query SF query to look for data with
 * @param {Function} callback triggered when new data is received
 * @return {null}
 * @publish
 */
Adaptor.prototype.query = function(query, callback) {
  if (!!this.userInfo) {
    this.sfCon.query(query, function(err, records) {
      if ("function" === typeof(callback)) {
        callback(err, records);
      }
    }.bind(this));
  }

  return !!this.userInfo;
};
