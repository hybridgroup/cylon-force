/*
 * cylon force driver
 * http://cylonjs.com
 *
 * Copyright (c) 2013-2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

'use strict';

var namespace = require('node-namespace');

require('./cylon-force');

namespace("Cylon.Drivers", function() {
  this.Force = (function(klass) {
    subclass(Force, klass);

    function Force(opts) {
      Force.__super__.constructor.apply(this, arguments);
      this.proxyMethods(Cylon.Force.Commands, this.connection, this);
    }

    Force.prototype.commands = function() {
      return Cylon.Force.Commands;
    };

    // Public: Starts the driver
    //
    // callback - params
    //
    // Returns null.
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

    // Public: Authenticate the driver.
    //
    // creds - params
    //
    // Returns null.
    Force.prototype.authenticate = function(creds) {
      return this.connection.authenticate(creds);
    };

    // Public: Subscribes the driver.
    //
    // streamPath - params
    // callback - params
    //
    // Returns null.
    Force.prototype.subscribe = function(streamPath, callback) {
      return this.connection.subscribe(streamPath, callback);
    };

    // Public: Pushes a message into the message queue.
    //
    // apexPath - params
    // method - params
    // data - params
    //
    // Returns (apexPath, method, JSON.stringify(data)).
    Force.prototype.push = function(apexPath, method, data) {
      return this.connection.push(apexPath, method, JSON.stringify(data));
    };

    return Force;

  })(Cylon.Driver);
});
