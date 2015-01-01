"use strict";

var Cylon = require("cylon");

Cylon
  .robot({ name: "salesforce", totalBucks: 0 })

  .connection("sphero", { adaptor: "sphero", port: "/dev/rfcomm0" })

  .connection("salesforce", {
    adaptor: "force",

    sfuser: process.env.SF_USERNAME,
    sfpass: process.env.SF_SECURITY_TOKEN,

    orgCreds: {
      clientId: process.env.SF_CLIENT_ID,
      clientSecret: process.env.SF_CLIENT_SECRET,
      redirectUri: "http://localhost:3000/oauth/_callback"
    }
  })

  .device("salesforce", { driver: "force", connection: "salesforce" })
  .device("sphero", { driver: "sphero", connection: "sphero" })

  .on("ready", function(bot) {
    console.log("Setting up collision detection.");
    bot.sphero.detectCollisions();

    bot.sphero.stop();
    bot.sphero.setRGB(0x00FF00);
    bot.sphero.roll(90, Math.floor(Math.random() * 360));

    bot.salesforce.subscribe("/topic/SpheroMsgOutbound", function(data) {
      var name = data.sobject.Sphero_Name__c,
          bucks = data.sobject.Bucks__c;

      console.log(
        "Sphero: " + name +
        ", data Bucks: " + bucks +
        ", SM_Id: " + data.sobject.Id
      );

      bot.sphero.setRGB(0x00FF00);
      bot.sphero.roll(90, Math.floor(Math.random() * 360));
    });

    bot.sphero.on("collision", function() {
      var data = { spheroName: bot.name, bucks: bot.totalBucks++ };

      bot.sphero.setRGB(0x0000FF);
      bot.sphero.stop();

      bot.salesforce.push("SpheroController", "POST", JSON.stringify(data));
    });
  })

.start();
