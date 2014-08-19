var Cylon = require('cylon');

Cylon.robot({
  connection: {
    name: 'sfcon',
    adaptor: 'force',
    sfuser: process.env.SF_USERNAME,
    sfpass: process.env.SF_SECURITY_TOKEN
  },

  device: {name: 'salesforce', driver: 'force'},

  work: function(me) {
    me.salesforce.subscribe('SpheroMsgOutbound', function(data) {
      console.log(data);
    });

    var i = 0 ;
    every((2).seconds(), function() {
      var toSend = {spheroName: 'globo', bucks: 1}
      me.salesforce.push('/SpheroController/', toSend);
    });
  }
});

Cylon.start();
