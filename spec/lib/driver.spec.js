"use strict";

var Driver = source('driver'),
    Commands = source('commands');

var Cylon = require('cylon');

describe('Cylon.Drivers.Force', function() {
  var driver;

  beforeEach(function() {
    driver = new Driver({ adaptor: {} });
  });

  it("subclasses Cylon.Driver", function() {
    expect(driver).to.be.an.instanceOf(Cylon.Driver);
    expect(driver).to.be.an.instanceOf(Driver);
  });

  describe("constructor", function() {
    beforeEach(function() {
      stub(Driver.prototype, 'proxyMethods');
      driver = new Driver({ adaptor: {} });
    });

    afterEach(function() {
      Driver.prototype.proxyMethods.restore();
    });

    it("proxies the SalesForce commands from the driver to the adaptor", function() {
      expect(driver.proxyMethods).to.be.calledWith(
        Commands,
        driver.adaptor,
        driver
      );
    });
  });

  describe("#commands", function() {
    it("is an array of SalesForce commands", function() {
      for (var c in driver.commands) {
        expect(driver.commands[c]).to.be.a('function');
      }
    });
  });

  describe("#start", function() {
    beforeEach(function() {
     stub(driver, 'defineDriverEvent');
    });

    afterEach(function() {
      driver.defineDriverEvent.restore();
    });

    it("defines driver events", function() {
      driver.start(function() { });

      expect(driver.defineDriverEvent).to.be.calledWith('push');
      expect(driver.defineDriverEvent).to.be.calledWith('subscribe');
    });
  });

  describe("#subscribe", function() {
    beforeEach(function() {
      driver.adaptor = { subscribe: spy() };
    });

    it("proxies to the adaptor's #subscribe method", function() {
      driver.subscribe("path");
      expect(driver.adaptor.subscribe).to.be.calledWith("path");
    });
  });

  describe("#push", function() {
    beforeEach(function() {
      driver.adaptor = { push: spy() };
    });

    it("proxies to the adaptor's #push method", function() {
      driver.push("path", { data: 'things' });

      expect(driver.adaptor.push).to.be.calledWith("path", { data: 'things' });
    });
  });
});
