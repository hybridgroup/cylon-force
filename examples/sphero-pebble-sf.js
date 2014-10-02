var cylon = require('cylon');

cylon.api({ host: '0.0.0.0', port: '8080' });

var PebbleRobot = function() {
  this.connection = {
    name: 'pebble', adaptor: 'pebble'
  };

  this.device = {
    name: 'pebble', driver: 'pebble'
  };

  this.message = function(robot, msg) {
    robot.message_queue().push(msg);
  };

  this.work = function(robot) {
    robot.pebble.on('connect', function() {
      cylon.Logger.info('connected!');
    });
  };
};

var SalesforceRobot = function() {
  this.connection = {
    name: 'sfcon',
    adaptor: 'force',
    sfuser: process.env.SF_USERNAME,
    sfpass: process.env.SF_SECURITY_TOKEN,
    orgCreds: {
      clientId: process.env.SF_CLIENT_ID,
      clientSecret: process.env.SF_CLIENT_SECRET,
      redirectUri: 'http://localhost:3000/oauth/_callback'
    }
  };

  this.device = {
    name: 'salesforce', driver: 'force'
  };

  this.spheroReport = {};

  this.work = function(robot) {
    robot.salesforce.subscribe('/topic/SpheroMsgOutbound', function(data) {
      var spheroName = data.sobject.Sphero_Name__c,
          bucks = data.sobject.Bucks__c;

      cylon.Logger.info("Sphero: #{ spheroName }, data Bucks: #{ bucks }, SM_Id: #{ data.sobject.Id }");
      robot.master.findRobot(spheroName, function(err, spheroBot) {
        spheroBot.react(spheroBot.devices.sphero);
      });

      robot.spheroReport[spheroName] = bucks;

      var toPebble = "";
      var val = '';

      for (var key in robot.spheroReport) {
        //toPebble += "#{key}: $#{val}\n";
        val = robot.spheroReport[key];
        toPebble += '' + key + ': $' + val + '\n';
      }

      robot.master.findRobot('pebble', function(error, pebbleBot) {
        pebbleBot.message(pebbleBot.devices.pebble, toPebble);
      });
    });
  };
};

var SpheroRobot = function() {
  this.totalBucks = 1;

  this.payingPower = true;

  this.connection = {
    name: 'sphero', adaptor: 'sphero'
  };

  this.device = {
    name: 'sphero', driver: 'sphero'
  };

  this.react = function(device) {
    device.setRGB(0x00FF00);
    device.roll(90, Math.floor(Math.random() * 360));
    this.payingPower = true;
  };

  this.bankrupt = function() {
    setInterval(function() {
      if (this.payingPower || (this.totalBucks > 0)) {
        this.totalBucks += -1;
        if (this.totalBucks === 0) {
          this.sphero.setRGB(0xFF000);
          this.sphero.stop();
        }
      }
    }.bind(this), 2000);
  };

  this.changeDirection = function() {
    setInterval(function() {
      if (this.payingPower) {
        this.sphero.roll(90, Math.floor(Math.random() * 360));
      }
    }.bind(this), 1000);
  };

  this.work = function(robot) {
    robot.sphero.on('connect', function() {
      cylon.Logger.info('Setting up Collision Detection...');
      robot.sphero.detectCollisions();
      robot.sphero.stop();
      robot.sphero.setRGB(0x00FF00);
      robot.sphero.roll(90, Math.floor(Math.random() * 360));
      robot.bankrupt();
      robot.changeDirection();
    });

    robot.sphero.on('collision', function() {
      robot.sphero.setRGB(0x0000FF);
      robot.sphero.stop();
      robot.payingPower = false;
      //var toSend = "{ \"spheroName\": \"#{ me.name }\", \"bucks\": \"#{ me.totalBucks++ }\" }";
      var toSend = '{ "spheroName": "' + robot.name + '", "bucks": "' + robot.totalBucks++ + '" }';
      robot.master.findRobot('salesforce', function(err, sf) {
        sf.devices.salesforce.push('SpheroController', 'POST', toSend);
      });
    });
  };
};

var sfRobot = new SalesforceRobot();
sfRobot.name = "salesforce";
cylon.robot(sfRobot);

var pebRobot = new PebbleRobot();
pebRobot.name = "pebble";
cylon.robot(pebRobot);

var bots = [
  { port: '/dev/tty.Sphero-ROY-AMP-SPP', name: 'ROY' },
  { port: '/dev/tty.Sphero-GBO-AMP-SPP', name: 'GBO'},
  { port: '/dev/tty.Sphero-RRY-AMP-SPP', name: 'RRY'}
];

var robot = null;

for (var key in bots) {
  robot = new SpheroRobot();
  robot.connection.port = bots[key].port;
  robot.name = bots[key].name;

  cylon.robot(robot);
}

cylon.start();
