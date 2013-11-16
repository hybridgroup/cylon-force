/*
 * cylon force driver
 * http://cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/


(function() {
  'use strict';
  var namespace,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  require('./cylon-force');

  namespace = require('node-namespace');

  namespace("Cylon.Driver", function() {
    return this.Force = (function(_super) {
      __extends(Force, _super);

      function Force(opts) {
        Force.__super__.constructor.apply(this, arguments);
        this.device = opts.device;
        this.connection = this.device.connection;
        this.proxyMethods(Cylon.Force.Commands, this.connection, this);
      }

      Force.prototype.commands = function() {
        return Cylon.Force.Commands;
      };

      Force.prototype.start = function(callback) {
        Logger.info("" + this.device.name + " started");
        this.defineDriverEvent({
          eventName: 'connect'
        });
        this.defineDriverEvent({
          eventName: 'authenticate'
        });
        this.defineDriverEvent({
          eventName: 'subscribe'
        });
        callback(null);
        return this.device.emit('start');
      };

      Force.prototype.authenticate = function(creds) {
        return this.connection.authenticate(creds);
      };

      Force.prototype.subscribe = function(streamPath, callback) {
        return this.connection.subscribe(streamPath, callback);
      };

      Force.prototype.push = function(apexPath, method, data) {
        return this.connection.push(apexPath, method, data);
      };

      Force.prototype.stop = function() {
        return Logger.info("Stopping Force driver...");
      };

      return Force;

    })(Cylon.Basestar);
  });

}).call(this);
