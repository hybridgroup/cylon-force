# Cylon.js For Force.com

Cylon.js (http://cylonjs.com) is a JavaScript framework for robotics and physical computing using Node.js

This module provides an adaptor and driver for Force.com (http://force.com/). It uses the official JSforce module (https://github.com/jsforce/jsforce).

[![Build Status](https://secure.travis-ci.org/hybridgroup/cylon-force.png?branch=master)](http://travis-ci.org/hybridgroup/cylon-force) [![Code Climate](https://codeclimate.com/github/hybridgroup/cylon-force/badges/gpa.svg)](https://codeclimate.com/github/hybridgroup/cylon-force) [![Test Coverage](https://codeclimate.com/github/hybridgroup/cylon-force/badges/coverage.svg)](https://codeclimate.com/github/hybridgroup/cylon-force)

## How to Install

    $ npm install cylon cylon-force

## How to Use

```javascript
var Cylon = require('cylon');

Cylon.robot({
  connections: {
    sfcon: {
      adaptor: 'force',
      sfuser: process.env.SF_USERNAME,
      sfpass: process.env.SF_SECURITY_TOKEN
    }
  },

  devices: {
    salesforce: { driver: 'force' }
  },

  work: function(me) {
    me.salesforce.subscribe('SpheroMsgOutbound', function(data) {
      console.log(data);
    });

    var i = 0 ;
    every((2).seconds(), function() {
      var toSend = {spheroName: 'globo', bucks: i++}
      me.salesforce.push('/SpheroController/', toSend);
    });
  }
});

Cylon.start();
```

To run the above example:

```
SF_USERNAME='yourusername' SF_SECURITY_TOKEN='yourpasswordandtoken' node examples/salesforce.js
```

## How to Connect

To setup Salesforce connection, authentication, app/object creation and streaming follo the instructions in:
https://github.com/hybridgroup/cylon-force/blob/master/salesforce-setup.md

### Connecting to Salesforce using cylon-force

If you are using a Salesforce developer account(or personal account), you only need to provide `sfuser` (username)
and `sfpass` (password + security_token to connect to the API as explain in Salesforce site) in the robot connection, as shown here:

```javascript
  connections: {
    sfcon: {
      adaptor: 'force',
      sfuser: process.env.SF_USERNAME,
      sfpass: process.env.SF_SECURITY_TOKEN
    }
  },
```

However if you are part of an organization, and having trouble querying/updating objects and streaming events,
you probably need to provide the organization credentials for authorization, this are the orgCreds/oauth2 credentials,
you can either pass `orgCreds` or `oauth2` parameter to the connection, as shown below and explain in the
[JSForce Docs](https://jsforce.github.io/document/):

```javascript
var cylon = require('cylon');

cylon.robot({
  connections: {
    sfcon: {
      adaptor: 'force',
      sfuser: process.env.SF_USERNAME,
      sfpass: process.env.SF_SECURITY_TOKEN,
      // orgCreds and oauth2 are interchangeable here, you can use either.
      orgCreds: {
        clientId: 'CLIENT_ID',
        clientSecret: 'CLIENT_SECRET',
        redirectUri: 'http://localhost:3000/oauth/_callback'
      }
    }
  },

  devices: {
    salesforce: { driver: 'force' }
  },

  work: function(me) {
    me.salesforce.subscribe('SpheroMsgOutbound', function(err, data) {
      console.log('arguments: ', arguments);
      cylon.Logger.info('err received:', err);
      cylon.Logger.info('data received:', data);
    });

    var counter = 0;

    every((2).seconds(), function() {
      var toSend = { spheroName: 'globo' + counter, bucks: counter };

      me.salesforce.push('/SpheroController/', toSend, function(err, data) {
        cylon.Logger.info('Sphero globo' + counter + ' has been sent to Salesforce.');
      });

      counter++;
    });
  }
});

cylon.start();
```

If you provide all credentials and still have problems to create/query/update objects and stream info from salesforce please
create an issue here: [cylon-force issues](https://github.com/hybridgroup/cylon-force/issues).

## Documentation
We're busy adding documentation to our web site at http://cylonjs.com/ please check there as we continue to work on Cylon.js

Thank you!

## Contributing

For our contribution guidelines, please go to [https://github.com/hybridgroup/cylon/blob/master/CONTRIBUTING.md
](https://github.com/hybridgroup/cylon/blob/master/CONTRIBUTING.md
).

## Release History

For the release history, please go to [https://github.com/hybridgroup/cylon-force/blob/master/RELEASES.md
](https://github.com/hybridgroup/cylon-force/blob/master/RELEASES.md
).

## License
Copyright (c) 2013-2015 The Hybrid Group. Licensed under the Apache 2.0 license.
