"use strict";

var Cylon = require("cylon");

Cylon.robot({
  name: "salesforce",

  totalBucks: 0,

  connections: {
    sphero: { adaptor: "sphero", port: "/dev/rfcomm0" },

    salesforce: {
      adaptor: "force",

      sfuser: process.env.SF_USERNAME,
      sfpass: process.env.SF_SECURITY_TOKEN,

      orgCreds: {
        clientId: process.env.SF_CLIENT_ID,
        clientSecret: process.env.SF_CLIENT_SECRET,
        redirectUri: "http://localhost:3000/oauth/_callback"
      }
    }
  },

  devices: {
    salesforce: { driver: "force", connection: "salesforce" },
    sphero: { driver: "sphero", connection: "sphero" }
  },

  work: function(my) {
    console.log("Setting up collision detection.");
    my.sphero.detectCollisions();

    my.sphero.stop();
    my.sphero.setRGB(0x00FF00);
    my.sphero.roll(90, Math.floor(Math.random() * 360));

    my.salesforce.subscribe("/topic/SpheroMsgOutbound", function(data) {
      var name = data.sobject.Sphero_Name__c,
          bucks = data.sobject.Bucks__c;

      console.log(
        "Sphero: " + name +
        ", data Bucks: " + bucks +
        ", SM_Id: " + data.sobject.Id
      );

      my.sphero.setRGB(0x00FF00);
      my.sphero.roll(90, Math.floor(Math.random() * 360));
    });

    my.sphero.on("collision", function() {
      var data = { spheroName: my.name, bucks: my.totalBucks++ };

      my.sphero.setRGB(0x0000FF);
      my.sphero.stop();

      my.salesforce.push("SpheroController", "POST", JSON.stringify(data));
    });
  }
}).start();
