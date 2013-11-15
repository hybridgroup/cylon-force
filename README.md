# Cylon.js For Force.com

Cylon.js (http://cylonjs.com) is a JavaScript framework for robotics and physical computing using Node.js

This module provides an adaptor and drivers for Force.com (http://force.com/). It uses the nforce module (https://github.com/kevinohara80/nforce) created by [@kevinohara80](https://github.com/kevinohara80) thank you!

[![Build Status](https://secure.travis-ci.org/hybridgroup/cylon-force.png?branch=master)](http://travis-ci.org/hybridgroup/cylon-force)

## Getting Started
Install the module with: `npm install cylon-force`

## Examples

```javascript
var Cylon = require('cylon');

...
```

```coffee-script
Cylon = require 'cylon'

Cylon.robot
...
```

## Configure Salesforce
- Start with a standard developer org -- http://developer.force.com/join
- Install the package for the simple Streaming API demo here
https://github.com/ReidCarlberg/LAB-Streaming-API-Demo
(Link in the read me.)
- Configure a new connected app in your developer org.
Setup (top) > Create (side) > Apps > Connected Apps (scroll down) > New
- Check "Enable Oauth Settings"
- Add all permissions
- Use "http://localhost:3000/oauth/_callback" as your callback URL
- You'll be using the Oauth2 web server flow
https://help.salesforce.com/apex/HTViewHelpDoc?id=remoteaccess_oauth_web_server_flow.htm&language=en
- You need your personal security code.
Setup > My Personal Information > Reset My Security Code
- Use your password in the connection info PASSWORDsecurityCode (concatenated, no space)
- For bi-directional communication, the Salesforce package has the Device, Device Reading and Device Message objects: https://login.salesforce.com/packaging/installPackage.apexp?p0=04tE00000001XSP

## Documentation
We're busy adding documentation to our web site at http://cylonjs.com/ please check there as we continue to work on Cylon.js

Thank you!

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
None yet...

## License
Copyright (c) 2013 The Hybrid Group. Licensed under the Apache 2.0 license.
