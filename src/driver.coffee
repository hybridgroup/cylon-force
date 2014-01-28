###
 * cylon force driver
 * http://cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
###

'use strict';

require './cylon-force'

namespace = require 'node-namespace'

namespace "Cylon.Drivers", ->
  class @Force extends Cylon.Driver
    constructor: (opts) ->
      super
      @proxyMethods Cylon.Force.Commands, @connection, this

    commands: -> Cylon.Force.Commands

    # Public: Starts the driver
    #
    # callback - params
    #
    # Returns null.
    start: (callback) ->
      @defineDriverEvent eventName: 'connect'
      @defineDriverEvent eventName: 'authenticate'
      @defineDriverEvent eventName: 'subscribe'

      super
    # Public: Authenticate the driver.
    #
    # creds - params
    #
    # Returns null.
    authenticate: (creds) ->
      @connection.authenticate(creds)

    # Public: Aubscribes the driver.
    #
    # streamPath - params
    # callback - params
    #
    # Returns null.
    subscribe: (streamPath, callback) ->
      @connection.subscribe(streamPath, callback)

    # Public: Pushes info about the driver.
    #
    # apexPath - params
    # method - params
    # data - params
    #
    # Returns (apexPath, method, JSON.stringify(data)).
    push: (apexPath, method, data) ->
      return @connection.push(apexPath, method, JSON.stringify(data))
