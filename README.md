# Cylon.js For Force.com

Cylon.js (http://cylonjs.com) is a JavaScript framework for robotics and physical computing using Node.js

This module provides an adaptor and driver for Force.com (http://force.com/). It uses the nforce module (https://github.com/kevinohara80/nforce) created by [@kevinohara80](https://github.com/kevinohara80) thank you!

[![Build Status](https://secure.travis-ci.org/hybridgroup/cylon-force.png?branch=master)](http://travis-ci.org/hybridgroup/cylon-force)

## Getting Started
Install the module with: `npm install cylon-force`

## Examples

### JavaScript
```javascript
var Cylon = require('cylon');

Cylon.robot({
  connection: { name: 'sfcon', 
                adaptor: 'force', 
                sfuser: process.env.SF_USERNAME,
                sfpass: process.env.SF_SECURITY_TOKEN,
                orgCreds: {
                  clientId: process.env.SF_CLIENT_ID,
                  clientSecret: process.env.SF_CLIENT_SECRET,
                  redirectUri: 'http://localhost:3000/oauth/_callback'
                }
              },
  device: {name: 'salesforce', driver: 'force'},

  work: function(me) {
    me.salesforce.on('start', function() {
      me.salesforce.subscribe('/topic/SpheroMsgOutbound', function(data) {
        Logger.info("Sphero:"+data.sobject.Sphero_Name__c+", Bucks: "+data.sobject.Bucks__c+", SM_Id: "+data.sobject.Id);
      });
    });

    var i = 0;
    
    every((2).seconds(), function() { 
      var toSend = "{ 'spheroName' :'"+me.name+"', 'bucks': "+i+" }"
      me.salesforce.push('SpheroController', 'POST', toSend);
    });
  }
}).start();
```

### CoffeeScript
```
Cylon = require 'cylon'

Cylon.robot
  connection:
    name: 'sfcon',
    adaptor: 'force',
    sfuser: process.env.SF_USERNAME,
    sfpass: process.env.SF_SECURITY_TOKEN,
    orgCreds: {
      clientId: process.env.SF_CLIENT_ID,
      clientSecret: process.env.SF_CLIENT_SECRET,
      redirectUri: 'http://localhost:3000/oauth/_callback'
    }

  device:
    name: 'salesforce', driver: 'force'

  work: (me) ->
    me.salesforce.on('start', () ->
      me.salesforce.subscribe('/topic/SpheroMsgOutbound', (data) ->
        Logger.info "Sphero: #{ data.sobject.Sphero_Name__c }, Bucks: #{ data.sobject.Bucks__c }, SM_Id: #{ data.sobject.Id }"
      )
    )

    i = 0
    every 2.seconds(), () ->
      toSend = "{ \"spheroName\" :\"#{ me.name }\", \"bucks\": \"#{ i }\" }"
      me.salesforce.push('SpheroController', 'POST', toSend)

.start()
```

## Configure Salesforce

To setup salesforce connection, authentication, app/object creation and streaming follo the instructions in:
https://github.com/hybridgroup/cylon-force/blob/master/salesforce-setup.md

## Documentation
We're busy adding documentation to our web site at http://cylonjs.com/ please check there as we continue to work on Cylon.js

Thank you!

## Contributing

* All patches must be provided under the Apache 2.0 License
* Please use the -s option in git to "sign off" that the commit is your work and you are providing it under the Apache 2.0 License
* Submit a Github Pull Request to the appropriate branch and ideally discuss the changes with us in IRC.
* We will look at the patch, test it out, and give you feedback.
* Avoid doing minor whitespace changes, renamings, etc. along with merged content. These will be done by the maintainers from time to time but they can complicate merges and should be done seperately.
* Take care to maintain the existing coding style.
* Add unit tests for any new or changed functionality & Lint and test your code using [Grunt](http://gruntjs.com/).
* All pull requests should be "fast forward"
  * If there are commits after yours use “git rebase -i <new_head_branch>”
  * If you have local changes you may need to use “git stash”
  * For git help see [progit](http://git-scm.com/book) which is an awesome (and free) book on git

## Release History

Version 0.5.0 - Release for cylon 0.11.0, refactor into pure JavaScript

Version 0.4.0 - Release for cylon 0.10.0

Version 0.3.0 - Release for cylon 0.9.0

Version 0.2.0 - Release for cylon 0.8.0

Version 0.1.0 - Initial release

## License
Copyright (c) 2013-2014 The Hybrid Group. Licensed under the Apache 2.0 license.
