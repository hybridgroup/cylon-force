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

    start: (callback) ->
      @defineDriverEvent eventName: 'connect'
      @defineDriverEvent eventName: 'authenticate'
      @defineDriverEvent eventName: 'subscribe'

      super

    authenticate: (creds) ->
      @connection.authenticate(creds)

    subscribe: (streamPath, callback) ->
      @connection.subscribe(streamPath, callback)

    push: (apexPath, method, data) ->
      return @connection.push(apexPath, method, JSON.stringify(data))
