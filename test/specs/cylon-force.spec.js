"use strict";

var module = source("cylon-force");

var Adaptor = source('adaptor'),
    Driver = source('driver');

describe("Cylon.Force", function() {
  describe("#register", function() {
    var robot, adaptor, driver;

    beforeEach(function() {
      robot = { registerAdaptor: spy(), registerDriver: spy() };

      adaptor = robot.registerAdaptor;
      driver = robot.registerDriver;

      module.register(robot);
    });

    it("registers the 'force' adaptor with the robot", function() {
      expect(adaptor).to.be.calledWith('cylon-force', 'force');
    });

    it("registers the 'force' driver with the robot", function() {
      expect(driver).to.be.calledWith('cylon-force', 'force');
    });
  });

  describe("#adaptor", function() {
    it("returns a new instance of the Force adaptor", function() {
      expect(module.adaptor()).to.be.an.instanceOf(Adaptor);
    });
  });

  describe("#driver", function() {
    it("returns a new instance of the Force driver", function() {
      expect(module.driver({ device: {} })).to.be.an.instanceOf(Driver);
    });
  });
});
