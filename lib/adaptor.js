/*
 * cylon salesforce adaptor
 * http://cylonjs.com
 *
 * Copyright (c) 2013-2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var Cylon = require('cylon'),
    NForce = require('nforce'),
    Faye = require('faye');

var Commands = require('./commands');

var Adaptor = module.exports = function Adaptor(opts) {
  var extraParams;
  if (opts == null) {
    opts = {};
  }
  Adaptor.__super__.constructor.apply(this, arguments);
  extraParams = opts.extraParams || {};
  this.orgCreds = extraParams.orgCreds;
  this.sfuser = extraParams.sfuser;
  this.sfpass = extraParams.sfpass;
  this.sfCon = null;
  this.fayeClient = null;
  this.oauth = null;
};

Cylon.Utils.subclass(Adaptor, Cylon.Adaptor);

Adaptor.prototype.commands = function() {
  return Commands;
};

Adaptor.prototype.connect = function(callback) {
  Cylon.Logger.info("Creating connection to '" + this.name + "'...");
  return this._authenticate(callback);
};

Adaptor.prototype._authenticate = function(callback) {
  var _this = this;
  this.sfCon = NForce.createConnection(this.orgCreds);
  return this.sfCon.authenticate({
    username: this.sfuser,
    password: this.sfpass
  }, function(err, _oauth) {
    var code;
    if (err) {
      Cylon.Logger.error('Unable to authenticate to Salesforce!');
      Cylon.Logger.error(err);
      return process.exit(code = 0);
    } else {
      Cylon.Logger.debug("Authenticated to Salesforce");
      _this.oauth = _oauth;
      _this.fayeClient = new Faye.Client(_this.oauth.instance_url + '/cometd/28.0');
      _this.fayeClient.setHeader("Authorization", "OAuth " + _this.oauth.access_token);
      Cylon.Logger.debug("Salesforce streaming client ready to subscribe...");
      callback(null);
      return _this.connection.emit('connect');
    }
  });
};

Adaptor.prototype.subscribe = function(streamPath, callback) {
  var subscription;
  subscription = this.fayeClient.subscribe(streamPath, callback);
  return this.connection.emit('subscribe', subscription);
};

Adaptor.prototype.push = function(apexPath, method, data) {
  var _this = this;
  if (this.oauth != null) {
    this.sfCon.apexRest({
      uri: apexPath,
      method: method,
      body: data
    }, this.oauth, function(err, resp) {
      if (err) {
        Cylon.Logger.error(err);
        return _this.connection.emit('error', err);
      } else {
        Cylon.Logger.debug(resp);
        return _this.connection.emit('push', resp);
      }
    });
  }
  return this.oauth != null;
};
