/*
 * cylon salesforce adaptor
 * http://cylonjs.com
 *
 * Copyright (c) 2013-2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var Cylon = require('cylon'),
    JSForce = require('jsforce');

var Commands = require('./commands');

var Adaptor = module.exports = function Adaptor(opts) {
  if (opts == null) {
    opts = {};
  }

  Adaptor.__super__.constructor.apply(this, arguments);

  var extraParams = opts.extraParams || {};

  this.oauth2Creds = extraParams.orgCreds || extraParams.oauth2;

  this.connCreds = {
    oauth2: this.oauth2Creds,
    serverUrl: extraParams.serverUrl,
    sessionId: extraParams.sessionId,
    instanceUrl: extraParams.instanceUrl,
    accessToken: extraParams.accessToken,
    refreshToken: extraParams.refreshToken
  };

  this.sfuser = extraParams.sfuser;
  this.sfpass = extraParams.sfpass;

  this.sfCon = null;
  this.userInfo = null;
};

Cylon.Utils.subclass(Adaptor, Cylon.Adaptor);

Adaptor.prototype.commands = Commands;

Adaptor.prototype.connect = function(callback) {
  console.log('PASSING ORG CREDS TO SALESFORCE:', this.connCreds);
  this.sfCon = new JSForce.Connection(this.connCreds);

  this.sfCon.login(this.sfuser, this.sfpass, function(err, userInfo) {
    if (!!err) {
      throw new Error(err);
    }

    this.userInfo = userInfo;

    callback();
  }.bind(this));
};

Adaptor.prototype.disconnect = function(callback) {
  callback();
};

Adaptor.prototype.subscribe = function(topic, callback) {
  if (!!this.userInfo) {
    var adCallback = function(data) {
      this.connection.emit('push', data);

      if ('function' === typeof(callback)) {
        callback(null, data);
      }
    }.bind(this);

    this.sfCon.streaming.topic(topic).subscribe(adCallback);
  }

  return !!this.userInfo;
};

Adaptor.prototype.post = function(apexPath, data, callback) {
  if (!!this.userInfo) {
    this.sfCon.apex.post(apexPath, data, function(err, res) {
      if ('function' === typeof(callback)) {
        callback(err, res);
      }
    }.bind(this));
  }

  return !!this.userInfo;
};

Adaptor.prototype.push = Adaptor.prototype.post;

Adaptor.prototype.get = function(apexPath, callback) {
  if (!!this.userInfo) {
    this.sfCon.apex.get(apexPath, function(err, res) {
      if ('function' === typeof(callback)) {
        callback(err, res);
      }
    }.bind(this));
  }

  return !!this.userInfo;
};

Adaptor.prototype.query = function(query, callback) {
  if (!!this.userInfo) {
    this.sfCon.query(query, function(err, records) {
      if ('function' === typeof(callback)) {
        callback(err, records);
      }
    }.bind(this));
  }

  return !!this.userInfo;
};
