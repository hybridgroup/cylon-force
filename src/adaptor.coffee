###
 * cylon salesforce adaptor
 * http://cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
###

'use strict';

require './cylon-force'
NForce = require('nforce')
Faye = require('faye')

namespace = require 'node-namespace'

namespace "Cylon.Adaptor", ->
  class @Force extends Cylon.Basestar
    constructor: (opts) ->
      super
      @connection = opts.connection
      @name = opts.name
      @orgCreds = opts.extraParams.orgCreds
      @sfuser = opts.extraParams.sfuser
      @sfpass = opts.extraParams.sfpass
      @sfCon = null
      @fayeClient = null
      @oauth = null

    commands: -> Cylon.Force.Commands

    connect: (callback) ->
      Logger.info "Creating connection to '#{@name}'..."
      @_authenticate(callback)


    disconnect: () ->
      Logger.info "Disconnecting force adaptor ..."

    _authenticate: (callback) ->
      @sfCon = NForce.createConnection(@orgCreds)

      @sfCon.authenticate({ username: @sfuser, password: @sfpass}, (err, _oauth) =>
        if(err)
          Logger.error 'Unable to authenticate to Salesforce!'
          Logger.error err
          process.exit(code=0)
        else
          Logger.debug "Authenticated to Salesforce"
          @oauth = _oauth
          @fayeClient = new Faye.Client(@oauth.instance_url + '/cometd/28.0')
          @fayeClient.setHeader("Authorization", "OAuth #{ @oauth.access_token }")

          Logger.debug "Salesforce streaming client ready to subscribe..."
          (callback)(null)
          @connection.emit 'connect'
      )

    subscribe: (streamPath, callback) ->
      subscription = @fayeClient.subscribe(streamPath, callback)
      @connection.emit 'subscribe', subscription

    push: (apexPath, method, data) ->
      @sfCon.apexRest({uri: apexPath, method: method, body: data}, @oauth, (err,resp) =>
        if(err)
          Logger.error err
          @connection.emit 'error', err
        else
          Logger.debug resp
          @connection.emit 'push', resp
      ) if @oauth?
