var Cylon = require('cylon');

Cylon.api({ host: '0.0.0.0', port: '8080' });

var spheros = [
  { port: '/dev/tty.Sphero-ROY-AMP-SPP', name: 'ROY' },
  { port: '/dev/tty.Sphero-GBO-AMP-SPP', name: 'GBO' },
  { port: '/dev/tty.Sphero-RRY-AMP-SPP', name: 'RRY' }
];

Cylon.robot({
  name: "Pebble",

  connections: {
    pebble: { adaptor: 'pebble' }
  },

  devices: {
    pebble: { driver: 'pebble' }
  },

  message: function(msg) {
    this.message_queue().push(msg);
  },

  work: function(my) {
    my.pebble.on('connect', function() {
      console.log("Pebble connected.");
    });
  }
});

Cylon.robot({
  name: "SalesForce",

  connections: {
    sfcon: {
      adaptor: 'force',
      sfuser: process.env.SF_USERNAME,
      sfpass: process.env.SF_SECURITY_TOKEN,
      orgCreds: {
        clientId: process.env.SF_CLIENT_ID,
        clientSecret: process.env.SF_CLIENT_SECRET,
        redirectUri: 'http://localhost:3000/oauth/_callback'
      }
    }
  },

  devices: {
   salesforce: { driver: 'force' }
  },

  spheroReport: {},

  work: function(my) {
    my.salesforce.subscribe('/topic/SpheroMsgOutbound', function(data) {
      var name = data.sobject.Sphero_Name__c,
          bucks = data.sobject.Bucks__c,
          sphero = Cylon.robots[name],
          toPebble = "";

      sphero.react();

      my.spheroReport[name] = bucks;

      for (var key in my.spheroReport) {
        var val = my.spheroReport[key];
        toPebble += key + ': $' + val + '\n';
      }

      var pebble = Cylon.robots.Pebble;
      pebble.message(toPebble);
    });
  }
});

spheros.forEach(function(bot) {
  Cylon.robot({
    name: bot.name,

    totalBucks: 1,
    payingPower: true,

    react: function() {
      this.sphero.setRGB(0x00FF00);
      this.sphero.roll(90, Math.floor(Math.random() * 360));
      this.payingPower = true;
    },

    bankrupt: function() {
      setInterval(function() {
        if (this.payingPower || (this.totalBucks > 0)) {
          this.totalBucks += -1;
          if (this.totalBucks === 0) {
            this.sphero.setRGB(0xFF000);
            this.sphero.stop();
          }
        }
      }.bind(this), 2000);
    },

    changeDirection: function() {
      setInterval(function() {
        if (this.payingPower) {
          this.sphero.roll(90, Math.floor(Math.random() * 360));
        }
      }.bind(this), 1000);
    },

    connections: {
      sphero: { adaptor: 'sphero', port: bot.port }
    },

    devices: {
      sphero: { driver: 'sphero' }
    },

    work: function(my) {
      console.log("Setting up collision detection for " + my.name + ".");
      my.sphero.detectCollisions();

      my.sphero.stop();
      my.sphero.setRGB(0x00FF00);
      my.sphero.roll(90, Math.floor(Math.random() * 360));

      my.bankrupt();
      my.changeDirection();

      my.sphero.on('collision', function() {
        my.sphero.setRGB(0x0000FF);
        my.sphero.stop();

        my.payingPower = false;

        var data = {
          spheroName: my.name,
          bucks: my.totalBucks++
        };

        var sf = Cylon.robots.Salesforce;
        sf.devices.salesforce.push('SpheroController', 'POST', JSON.stringify(data));
      });
    }
  });
});

Cylon.start();
