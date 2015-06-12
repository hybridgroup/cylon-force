"use strict";

var force = lib("cylon-force");

var Adaptor = lib("adaptor"),
    Driver = lib("driver");

describe("Cylon.Force", function() {
  describe("#adaptors", function() {
    it("is an array of supplied adaptors", function() {
      expect(force.adaptors).to.be.eql(["force"]);
    });
  });

  describe("#drivers", function() {
    it("is an array of supplied drivers", function() {
      expect(force.drivers).to.be.eql(["force"]);
    });
  });

  describe("#adaptor", function() {
    it("returns a new instance of the Force adaptor", function() {
      expect(force.adaptor()).to.be.an.instanceOf(Adaptor);
    });
  });

  describe("#driver", function() {
    it("returns a new instance of the Force driver", function() {
      var opts = { device: { connection: { } } };
      expect(force.driver(opts)).to.be.an.instanceOf(Driver);
    });
  });
});
