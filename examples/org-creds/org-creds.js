"use strict";

var Cylon = require("cylon");

Cylon.robot({
  connections: {
    sfcon: {
      adaptor: "force",

      sfuser: process.env.SF_USERNAME,
      sfpass: process.env.SF_SECURITY_TOKEN,

      // orgCreds and oauth2 are interchangeable here, you can use either.
      orgCreds: {
        clientId: "CLIENT_ID",
        clientSecret: "CLIENT_SECRET",
        redirectUri: "http://localhost:3000/oauth/_callback"
      }
    }
  },

  devices: {
    salesforce: { driver: "force" }
  },

  work: function(me) {
    me.salesforce.subscribe("SpheroMsgOutbound", function(err, data) {
      console.log("err received:", err);
      console.log("data received:", data);
    });

    var counter = 0;

    every((2).seconds(), function() {
      var toSend = { spheroName: "globo" + counter, bucks: counter };

      me.salesforce.push("/SpheroController/", toSend, function() {
        console.log("Sphero globo" + counter + " has been sent to Salesforce.");
      });

      counter++;
    });
  }
});

Cylon.start();
