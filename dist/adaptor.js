/*
 * cylon salesforce adaptor
 * http://cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/


(function() {
  'use strict';
  var Faye, NForce, namespace,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  require('./cylon-force');

  NForce = require('nforce');

  Faye = require('faye');

  namespace = require('node-namespace');

  namespace("Cylon.Adaptor", function() {
    return this.Force = (function(_super) {
      __extends(Force, _super);

      function Force(opts) {
        Force.__super__.constructor.apply(this, arguments);
        this.connection = opts.connection;
        this.name = opts.name;
        this.orgCreds = opts.orgCredentials;
        this.sfuser = opts.sfuser;
        this.sfpass = opts.sfpass;
        this.sfCon = null;
        this.fayeClient = null;
        this.oauth;
      }

      Force.prototype.commands = function() {
        return Cylon.Force.Commands;
      };

      Force.prototype.connect = function(callback) {
        Logger.info("Creating connection to '" + this.name + "'...");
        callback(null);
        return this.connection.emit('connect');
      };

      Force.prototype.disconnect = function() {
        return console.log("Disconnecting force adaptor ...");
      };

      Force.prototype.authenticate = function(creds) {
        var _this = this;
        if (this.sfuser == null) {
          this.sfuser = creds.sfuser;
        }
        if (this.sfpass == null) {
          this.sfpass = creds.sfpass;
        }
        if (this.orgCreds == null) {
          this.orgCreds = creds.orgCreds;
        }
        this.sfCon = NForce.createConnection(this.orgCreds);
        return this.sfCon.authenticate({
          username: this.sfuser,
          password: this.sfpass
        }, function(err, _oauth) {
          var code;
          if (err) {
            console.error('unable to authenticate to SF');
            console.log(err);
            return process.exit(code = 0);
          } else {
            console.log("Authenticated");
            _this.oauth = _oauth;
            _this.fayeClient = new Faye.Client(_this.oauth.instance_url + '/cometd/28.0');
            _this.fayeClient.setHeader("Authorization", "OAuth " + _this.oauth.access_token);
            console.log("Streaming client ready to subscribe...");
            return _this.connection.emit('authenticate', _oauth);
          }
        });
      };

      Force.prototype.subscribe = function(streamPath, callback) {
        var subscription;
        subscription = this.fayeClient.subscribe(streamPath, callback);
        return this.connection.emit('subscribe', subscription);
      };

      Force.prototype.push = function(apexPath, method, data) {
        var _this = this;
        return this.sfCon.apexRest({
          uri: apexPath,
          method: method,
          body: data
        }, this.oauth, function(err, resp) {
          if (err) {
            console.log(err);
            return _this.connection.emit('error', err);
          } else {
            console.log(resp);
            return _this.connection.emit('push', resp);
          }
        });
      };

      return Force;

    })(Cylon.Basestar);
  });

}).call(this);
