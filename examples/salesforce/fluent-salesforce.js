var Cylon = require('cylon');

Cylon
  .robot()
  .connection('sfcon', {
    adaptor: 'force',
    sfuser: process.env.SF_USERNAME,
    sfpass: process.env.SF_SECURITY_TOKEN
  })

  .device('salesforce', { driver: 'force' })

  .on('ready', function(bot) {
    bot.salesforce.subscribe('SpheroMsgOutbound', function(data) {
      console.log(data);
    });

    setInterval(function() {
      var toSend = { spheroName: 'globo', bucks: 1 };
      bot.salesforce.push('/SpheroController/', toSend);
    }, 2000);
  });

Cylon.start();
