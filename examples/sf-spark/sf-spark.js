"use strict";

var Cylon = require("cylon");

Cylon.robot({
  connections: {
    spark: {
      adaptor: "spark",
      accessToken: "accessToken1",
      deviceId: "deviceId1",
      module: "cylon-spark"
    },

    spark2: {
      name: "spark2",
      adaptor: "spark",
      accessToken: "accessToken1",
      deviceId: "deviceId1",
      module: "cylon-spark"
    },

    sfcon: {
      adaptor: "force",
      sfuser: process.env.SF_USERNAME,
      sfpass: process.env.SF_SECURITY_TOKEN
    }
  },

  devices: {
    spark: { driver: "spark", connections: "spark" },
    sensor: {
      driver: "analogSensor",
      pin: "A0",
      connection: "spark",
      lowerLimit: 100,
      upperLimit: 900
    },
    led: { driver: "led", pin: "A1", connection: "spark2" },
    salesforce: { driver: "force", connection: "sfcon" }
  },

  work: function(my) {
    my.salesforce.subscribe("SparkOutboundMsg", function(err, data) {
      if (err) { return console.log(err); }

      console.log("Spark Data received from Salesforce:", data);

      var analogValue = data.sobject.Analog_Read__c || 0;
      var scaledBrightness = (analogValue).fromScale(0, 4095).toScale(0, 255);

      my.led.brightness(Math.round(scaledBrightness));

      console.log("Analog value => ", analogValue);
      console.log("scaled brightness for led:", scaledBrightness);
    });

    every((2).seconds(), function() {
      var analogValue = my.sensor.analogRead() || 0,
          toSend = { sparkName: my.spark.core().name, value: analogValue };

      console.log("Data to send to Salesforce:", toSend);

      my.salesforce.push("/SparkController/", toSend, function() {
        var name = my.spark.core().name;
        console.log(
          "Spark core '" + name + "' analog read has been sent to Salesforce."
        );
      });
    });
  }
}).start();
