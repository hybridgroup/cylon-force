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
  if (opts == null) {
    opts = {};
  }

  Adaptor.__super__.constructor.apply(this, arguments);

  var extraParams = opts.extraParams || {};

  this.orgCreds = extraParams.orgCreds;
  this.sfuser = extraParams.sfuser;
  this.sfpass = extraParams.sfpass;

  this.sfCon = null;
  this.fayeClient = null;
  this.oauth = null;
};

Cylon.Utils.subclass(Adaptor, Cylon.Adaptor);

Adaptor.prototype.commands = Commands;

Adaptor.prototype.connect = function(callback) {
  Cylon.Logger.info("Creating connection to '" + this.name + "'...");

  var auth = {
    username: this.sfuser,
    password: this.sfpass
  };

  this.sfCon = NForce.createConnection(this.orgCreds);

  this.sfCon.authenticate(auth, function(err, oauth) {
    if (!!err) {
      throw new Error(err);
    }

    this.oauth = oauth;

    this.fayeClient = new Faye.Client(oauth.instance_url + '/cometd/28.0');
    this.fayeClient.setHeader("Authorization", "OAuth " + oauth.access_token);

    callback(null);

    this.connection.emit('connect');
  }.bind(this));
};

Adaptor.prototype.subscribe = function(streamPath, callback) {
  var subscription = this.fayeClient.subscribe(streamPath, callback);
  this.connection.emit('subscribe', subscription);
};

Adaptor.prototype.push = function(apexPath, method, data) {
  if (!!this.oauth) {
    var opts = { uri: apexPath, method: method, body: data };

    this.sfCon.apexRest(opts, this.oauth, function(err, resp) {
      if (!!err) {
        Cylon.Logger.error(err);
        this.connection.emit('error', err);
      }

      Cylon.Logger.debug(resp);
      this.connection.emit('push', resp);
    }.bind(this));
  }

  return !!this.oauth
};
