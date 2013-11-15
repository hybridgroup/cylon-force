(function() {
  'use strict';
  var cylonForce;

  cylonForce = source("cylon-force");

  describe("basic tests", function() {
    it("standard async test", function(done) {
      var bool;
      bool = false;
      bool.should.be["false"];
      setTimeout(function() {
        bool.should.be["false"];
        bool = true;
        return bool.should.be["true"];
      });
      150;
      setTimeout(function() {
        bool.should.be["true"];
        return done();
      });
      return 300;
    });
    it("standard sync test", function() {
      var data, obj;
      data = [];
      obj = {
        id: 5,
        name: 'test'
      };
      data.should.be.empty;
      data.push(obj);
      data.should.have.length(1);
      data[0].should.be.eql(obj);
      return data[0].should.be.equal(obj);
    });
    return it("cylon-force should be awesome", function() {
      cylonForce.should.have.keys('awesome');
      cylonForce.awesome.should.be.a('function');
      return cylonForce.awesome().should.be.equal('awesome');
    });
  });

}).call(this);
