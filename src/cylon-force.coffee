###
 * cylon-force
 * http://cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
###

'use strict';

namespace = require 'node-namespace'

require './commands'
require './adaptor'
require './driver'

module.exports =
  adaptor: (args...) ->
    new Cylon.Adaptor.Force(args...)

  driver: (args...) ->
    new Cylon.Driver.Force(args...)

  register: (robot) ->
    Logger.info "Registering Force adaptor for #{robot.name}"
    robot.registerAdaptor 'cylon-force', 'force'

    Logger.info "Registering Force driver for #{robot.name}"
    robot.registerDriver 'cylon-force', 'force'
