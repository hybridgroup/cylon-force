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

  namespace("Cylon.Drivers", function() {
    return this.Force = (function(_super) {
      __extends(Force, _super);

      function Force(opts) {
        Force.__super__.constructor.apply(this, arguments);
        this.proxyMethods(Cylon.Force.Commands, this.connection, this);
      }

      Force.prototype.commands = function() {
        return Cylon.Force.Commands;
      };

      # Public: Starts the driver
      #
      # callback - params
      #
      # Returns null.
      Force.prototype.start = function(callback) {
        this.defineDriverEvent({
          eventName: 'connect'
        });
        this.defineDriverEvent({
          eventName: 'authenticate'
        });
        this.defineDriverEvent({
          eventName: 'subscribe'
        });
        return Force.__super__.start.apply(this, arguments);
      };

      # Public: Authenticate the driver.
      #
      # creds - params
      #
      # Returns null.
      Force.prototype.authenticate = function(creds) {
        return this.connection.authenticate(creds);
      };

      # Public: Aubscribes the driver.
      #
      # streamPath - params
      # callback - params
      #
      # Returns null
      Force.prototype.subscribe = function(streamPath, callback) {
        return this.connection.subscribe(streamPath, callback);
      };

      # Public: Pushes info about the driver.
      #
      # apexPath - params
      # method - params
      # data - params
      #
      # Returns (apexPath, method, JSON.stringify(data)).
      Force.prototype.push = function(apexPath, method, data) {
        return this.connection.push(apexPath, method, JSON.stringify(data));
      };

      return Force;

    })(Cylon.Driver);
  });

}).call(this);
