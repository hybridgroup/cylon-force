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

  this.orgCreds = extraParams.orgCreds;
  this.sfuser = extraParams.sfuser;
  this.sfpass = extraParams.sfpass;

  this.sfCon = null;
  this.userInfo = null;
};

Cylon.Utils.subclass(Adaptor, Cylon.Adaptor);

Adaptor.prototype.commands = Commands;

Adaptor.prototype.connect = function(callback) {
  Cylon.Logger.info("Creating connection to '" + this.name + "'...");

  this.sfCon = new JSForce.Connection({});

  this.sfCon.login(this.sfuser, this.sfpass, function(err, userInfo) {
    if (!!err) {
      throw new Error(err);
    }

    this.userInfo = userInfo;

    callback(null);

    this.connection.emit('connect');
  }.bind(this));
};

Adaptor.prototype.subscribe = function(topic, callback) {
  if (!!this.userInfo) {
    this.sfCon.streaming.topic(topic).subscribe(callback);
    // TODO: event sent with subscription data?
  }

  return !!this.userInfo  
};

Adaptor.prototype.push = function(apexPath, data) {
  if (!!this.userInfo) {
    this.sfCon.apex.post(apexPath, data, function(err, res) {
      if (err) { return console.error(err); }
      console.log("response: ", res);
      // TODO: something with the returned data
    });    
  }

  return !!this.userInfo
};
