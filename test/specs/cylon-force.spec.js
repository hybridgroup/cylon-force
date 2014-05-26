"use strict";

var force = source("cylon-force");

describe("Cylon.Force", function() {
  it("can register the adaptor and driver", function() {
    force.register.should.be.a('function');
  });

  it("can create adaptor", function() {
    force.adaptor.should.be.a('function');
    expect(force.adaptor()).to.be.a('object');
  });

  it("can create driver", function() {
    force.driver.should.be.a('function');
    expect(force.driver({ device: {} })).to.be.a('object');
  });
});
