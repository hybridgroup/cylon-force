var cylon = require('cylon');

cylon.robot({
  name: 'salesforce',
  connection: {
    name: 'sfcon',
    adaptor: 'force',
    sfuser: process.env.SF_USERNAME,
    sfpass: process.env.SF_SECURITY_TOKEN,
    orgCreds: {
      clientId: process.env.SF_CLIENT_ID,
      clientSecret: process.env.SF_CLIENT_SECRET,
      redirectUri: 'http://localhost:3000/oauth/_callback'
    }
  },

  device: { name: 'salesforce', driver: 'force' }
})

.on('ready', function(me) {
  me.salesforce.on('start', function() {
    me.salesforce.subscribe('/topic/SpheroMsgOutbound', function(data) {
      var spheroName = data.sobject.Sphero_Name__c;

      cylon.Logger.info("Sphero: #{ spheroName }, data Bucks: #{ bucks }, SM_Id: #{ data.sobject.Id }");

      me.master.findRobot(spheroName, function(err, spheroBot) {
          spheroBot.react(spheroBot.devices.sphero);
      });
    });
  });
});

cylon.robot({
  name: 'ROY',
  totalBucks: 0,
  connection: { name: 'sphero', adaptor: 'sphero', port: '/dev/rfcomm0' },
  device: { name: 'sphero', driver: 'sphero' },

  react: function(robot) {
    robot.setRGB(0x00FF00);
    robot.roll(90, Math.floor(Math.random() * 360));
  }
})

.on('ready', function(me) {
  me.sphero.on('connect', function() {
    cylon.Logger.info('Setting up Collision Detection...');
    me.sphero.detectCollisions();
    me.sphero.stop();
    me.sphero.setRGB(0x00FF00);
    me.sphero.roll(90, Math.floor(Math.random() * 360));
  });

  me.sphero.on('collision', function() {
    me.sphero.setRGB(0x0000FF, me);
    me.sphero.stop();
    var toSend = "{ \"spheroName\" :\"#{ me.name }\", \"bucks\": \"#{ me.totalBucks++ }\" }";
    me.master.findRobot('salesforce', function(err, sf){
      sf.devices.salesforce.push('SpheroController', 'POST', toSend);
    });
  });
});

cylon.start();
