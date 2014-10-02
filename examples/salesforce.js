var cylon = require('cylon');

cylon.robot({
  connection: {
    name: 'sfcon',
    adaptor: 'force',
    sfuser: process.env.SF_USERNAME,
    sfpass: process.env.SF_SECURITY_TOKEN
  },

  device: {name: 'salesforce', driver: 'force'},

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
