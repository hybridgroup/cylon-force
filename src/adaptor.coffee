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
      @orgCreds = opts.orgCredentials
      @sfuser = opts.sfuser
      @sfpass = opts.sfpass
      @sfCon = null
      @fayeClient = null
      @oauth
      #@sfCon = NForce.createConnection(@orgCreds)
      #@proxyMethods Cylon.Force.Commands, @sfCon, this

    commands: -> Cylon.Force.Commands

    connect: (callback) ->
      Logger.info "Creating connection to '#{@name}'..."

      (callback)(null)
      @connection.emit 'connect'

    disconnect: () ->
      #disconnecting adaptor
      console.log("Disconnecting force adaptor ...")

    authenticate: (creds) ->
      @sfuser ?= creds.sfuser
      @sfpass ?= creds.sfpass
      @orgCreds ?= creds.orgCreds
      @sfCon = NForce.createConnection(@orgCreds)

      @sfCon.authenticate({ username: @sfuser, password: @sfpass}, (err, _oauth) =>
        if(err)
          console.error('unable to authenticate to SF')
          console.log(err)
          process.exit(code=0)
        else
          console.log("Authenticated")
          @oauth = _oauth
          @fayeClient = new Faye.Client(@oauth.instance_url + '/cometd/28.0')
          @fayeClient.setHeader("Authorization", "OAuth #{ @oauth.access_token }")
          console.log("Streaming client ready to subscribe...")
          @connection.emit 'authenticate', _oauth
      )

    subscribe: (streamPath, callback) ->
      subscription = @fayeClient.subscribe(streamPath, callback)
      @connection.emit 'subscribe', subscription

    push: (apexPath, method, data) ->
      @sfCon.apexRest({uri: apexPath, method: method, body: data}, @oauth, (err,resp) =>
        if(err)
          console.log(err)
          @connection.emit 'error', err
        else
          console.log(resp)
          @connection.emit 'push', resp
      )
