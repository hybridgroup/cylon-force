"use strict";

var Driver = source('driver'),
    Commands = source('commands');

var Cylon = require('cylon');

describe('Cylon.Drivers.Force', function() {
  var driver;

  beforeEach(function() {
    driver = new Driver({ connection: {} });
  });

  it("subclasses Cylon.Driver", function() {
    expect(driver).to.be.an.instanceOf(Cylon.Driver);
    expect(driver).to.be.an.instanceOf(Driver);
  });

  describe("constructor", function() {
    beforeEach(function() {
      stub(Driver.prototype, 'proxyMethods');
      driver = new Driver({ connection: {} });
    });

    afterEach(function() {
      Driver.prototype.proxyMethods.restore();
    });

    it("proxies the SalesForce commands from the driver to the connection", function() {
      expect(driver.proxyMethods).to.be.calledWith(
        Commands,
        driver.connection,
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
      driver.connection = { subscribe: spy() };
    });

    it("proxies to the connection's #subscribe method", function() {
      driver.subscribe("path");
      expect(driver.connection.subscribe).to.be.calledWith("path");
    });
  });

  describe("#push", function() {
    beforeEach(function() {
      driver.connection = { push: spy() };
    });

    it("proxies to the connection's #push method", function() {
      driver.push("path", { data: 'things' });

      expect(driver.connection.push).to.be.calledWith("path", { data: 'things' });
    });
  });
});
