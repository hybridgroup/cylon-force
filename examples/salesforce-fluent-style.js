var cylon = require('cylon');

cylon.robot({
  connection: {
    name: 'sfcon',
    adaptor: 'force',
    sfuser: process.env.SF_USERNAME,
    sfpass: process.env.SF_SECURITY_TOKEN
  },

  device: {name: 'salesforce', driver: 'force'}
})

.on('ready', function(robot) {
  robot.salesforce.subscribe('SpheroMsgOutbound', function(data) {
    console.log(data);
  });

  setInterval(function() {
    var toSend = { spheroName: 'globo', bucks: 1 };
    robot.salesforce.push('/SpheroController/', toSend);
  }, 2000);
})

.start();
