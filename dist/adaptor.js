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
        this.orgCreds = opts.extraParams.orgCreds;
        this.sfuser = opts.extraParams.sfuser;
        this.sfpass = opts.extraParams.sfpass;
        this.sfCon = null;
        this.fayeClient = null;
        this.oauth = null;
      }

      Force.prototype.commands = function() {
        return Cylon.Force.Commands;
      };

      Force.prototype.connect = function(callback) {
        Logger.info("Creating connection to '" + this.name + "'...");
        return this._authenticate(callback);
      };

      Force.prototype.disconnect = function() {
        return Logger.info("Disconnecting force adaptor ...");
      };

      Force.prototype._authenticate = function(callback) {
        var _this = this;
        this.sfCon = NForce.createConnection(this.orgCreds);
        return this.sfCon.authenticate({
          username: this.sfuser,
          password: this.sfpass
        }, function(err, _oauth) {
          var code;
          if (err) {
            Logger.error('Unable to authenticate to Salesforce!');
            Logger.error(err);
            return process.exit(code = 0);
          } else {
            Logger.debug("Authenticated to Salesforce");
            _this.oauth = _oauth;
            _this.fayeClient = new Faye.Client(_this.oauth.instance_url + '/cometd/28.0');
            _this.fayeClient.setHeader("Authorization", "OAuth " + _this.oauth.access_token);
            Logger.debug("Salesforce streaming client ready to subscribe...");
            callback(null);
            return _this.connection.emit('connect');
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
        if (this.oauth != null) {
          return this.sfCon.apexRest({
            uri: apexPath,
            method: method,
            body: data
          }, this.oauth, function(err, resp) {
            if (err) {
              Logger.error(err);
              return _this.connection.emit('error', err);
            } else {
              Logger.debug(resp);
              return _this.connection.emit('push', resp);
            }
          });
        }
      };

      return Force;

    })(Cylon.Basestar);
  });

}).call(this);
