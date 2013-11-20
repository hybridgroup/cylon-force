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

namespace "Cylon.Driver", ->
  class @Force extends Cylon.Basestar
    constructor: (opts) ->
      super
      @device = opts.device
      @connection = @device.connection
      @proxyMethods Cylon.Force.Commands, @connection, this

    commands: -> Cylon.Force.Commands

    start: (callback) ->
      Logger.info "#{@device.name} started"

      @defineDriverEvent eventName: 'connect'
      @defineDriverEvent eventName: 'authenticate'
      @defineDriverEvent eventName: 'subscribe'

      (callback)(null)
      @device.emit 'start'

    authenticate: (creds) ->
      @connection.authenticate(creds)

    subscribe: (streamPath, callback) ->
      @connection.subscribe(streamPath, callback)

    push: (apexPath, method, data) ->
      return @connection.push(apexPath, method, JSON.stringify(data))

    stop: () ->
      Logger.info "Stopping Force driver..."
