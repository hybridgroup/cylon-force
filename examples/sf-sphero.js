var cylon = require('cylon');

var salesforceRobot = {
  name: 'salesforce',

  totalBucks: 0,

  connection: [
    {
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
    { name: 'sphero', adaptor: 'sphero', port: '/dev/rfcomm0' }
  ],

  devices: [
    { name: 'salesforce', driver: 'force', connection: 'sfcon' },
    { name: 'sphero', driver: 'sphero', connection: 'sphero' }
  ],

  work: function(robot) {
    cylon.Logger.info('Setting up Collision Detection...');
    robot.sphero.detectCollisions();
    robot.sphero.stop();
    robot.sphero.setRGB(0x00FF00);
    robot.sphero.roll(90, Math.floor(Math.random() * 360));

    robot.salesforce.subscribe('/topic/SpheroMsgOutbound', function(data) {
      var spheroName = data.sobject.Sphero_Name__c,
          bucks = data.sobject.Bucks__c;

      cylon.Logger.info("Sphero: " + spheroName + ", data Bucks: " + bucks + ", SM_Id: " + data.sobject.Id);
      //cylon.Logger.info("Sphero: #{ spheroName }, data Bucks: #{ bucks }, SM_Id: #{ data.sobject.Id }");

      robot.sphero.setRGB(0x00FF00);
      robot.sphero.roll(90, Math.floor(Math.random() * 360));
    });

    robot.sphero.on('collision', function() {
      robot.sphero.setRGB(0x0000FF);
      robot.sphero.stop();
      var toSend = '{ "spheroName" :"' + robot.name + '", "bucks": "' + robot.totalBucks++ + '" }';
      //var toSend = "{ \"spheroName\" :\"#{ robot.name }\", \"bucks\": \"#{ robot.totalBucks++ }\" }";
      robot.salesforce.push('SpheroController', 'POST', toSend);
    });
  }
};

cylon.robot(salesforceRobot);

cylon.start();
