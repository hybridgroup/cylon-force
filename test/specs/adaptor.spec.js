"use strict";

var Adaptor = source('adaptor'),
    Commands = source('commands');

var Cylon = require('cylon'),
    JSForce = require('jsforce');

describe('Adaptor', function() {
  var adaptor = new Adaptor({
    extraParams: {
      sfuser: 'user',
      sfpass: 'pass'
    }
  });

  it("subclasses Cylon.Adaptor", function() {
    expect(adaptor).to.be.an.instanceOf(Cylon.Adaptor);
    expect(adaptor).to.be.an.instanceOf(Adaptor);
  });

  describe("constructor", function() {
    it('defaults @sfCon to null', function() {
      expect(adaptor.sfCon).to.be.eql(null);
    });

    it('defaults @userInfo to null', function() {
      expect(adaptor.userInfo).to.be.eql(null);
    });

    it('sets @sfuser to those passed in the device hash', function() {
      expect(adaptor.sfuser).to.be.eql("user");
    });

    it('sets @sfpass to those passed in the device hash', function() {
      expect(adaptor.sfpass).to.be.eql("pass");
    });
  });

  describe("#commands", function() {
    it('is an array of SF commands', function() {
      expect(adaptor.commands).to.be.eql(Commands);
    });
  });

  describe("#connect", function() {
    var sfCon, callback;;

    beforeEach(function() {
      callback = spy();
      sfCon = { login: stub() };
      stub(JSForce, 'Connection').returns(sfCon);
      adaptor.connection = { emit: spy() };
    });

    // it("opens a SalesForce connection with JSForce", function() {
    //   adaptor.connect(callback);
    //   expect(sfCon.login).to.be.called(); //With(adaptor.orgCreds);
    //   expect(adaptor.sfCon).to.be.eql(sfCon);
    // });

    it("attempts to authenticate with SalesForce", function() {
      var username = 'user', 
          password = 'pass';

      adaptor.connect(callback);
      expect(sfCon.login).to.be.calledWith(username, password);
    });

    context("if an error occuers while authenticating", function() {
      beforeEach(function() {
        stub(Cylon.Logger, 'error');
        sfCon.login.yields("error message");
      });

      afterEach(function() {
        Cylon.Logger.error.restore();
      });

      it("throws the error", function() {
        var fn = function() { adaptor.connect(callback); };
        expect(fn).to.throw(Error, "error message");
      });
    });

    context("if authentication is successful", function() {
      var client, userInfo;

      beforeEach(function() {
        client = { setHeader: spy() };
        userInfo = { instance_url: "http://localhost:1234", access_token: "ABCD" };

        sfCon.login.yields(null, userInfo);

        adaptor.connect(callback);
      });

      it('sets @userInfo to the returned credentials', function() {
        expect(adaptor.userInfo).to.be.eql(userInfo)
      });

      it("triggers the callback", function() {
        expect(callback).to.be.called;
      });

      it("emits 'connect'", function() {
        expect(adaptor.connection.emit).to.be.calledWith('connect');
      });
    });
  });

  describe("#subscribe", function() {
    var client, subscription, callback, emit;

    beforeEach(function() {
      subscription = 'subscribed';
      client = { subscribe: stub().returns(subscription) };
      callback = spy();

      adaptor.connection = { emit: spy() };

      adaptor.subscribe("mytopic", callback)
    });

    it("tells jsforce to subscribe to the provided topic", function() {
      expect(client.subscribe).to.be.calledWith("mytopic", callback);
    });

    it("emits the subscription on the 'subscribe' connection event", function() {
      emit = adaptor.connection.emit;
      expect(emit).to.be.calledWith("subscribe", subscription);
    });
  });

  describe("#push", function() {
    var oauth, sfCon;

    beforeEach(function() {
      oauth = adaptor.oauth = "oauth";
      sfCon = adaptor.sfCon = { apexRest: stub() };
      adaptor.connection = { emit: spy() };
    });

    it("returns a boolean indicating auth status", function() {
      expect(adaptor.push()).to.be.true;
      adaptor.oauth = null
      expect(adaptor.push()).to.be.false;
    });

    context("if authenticated", function() {
      it("uses the #apexRest JSForce method to push data", function() {
        var args = { uri: 'uri', method: 'method', body: 'body' };
        adaptor.push('uri', 'method', 'body');
        expect(sfCon.apex).to.be.calledWith(args, oauth);
      });

      context("if the push returns an error", function() {
        beforeEach(function() {
          sfCon.apex.yields("error");
          adaptor.push();
        });

        it('emits the error via the connection', function() {
          var emit = adaptor.connection.emit;
          expect(emit).to.be.calledWith("error", "error");
        });
      });

      context("if the push returns data", function() {
        beforeEach(function() {
          sfCon.apex.yields(null, "data");
          adaptor.push();
        });

        it('emits the data via the connection', function() {
          var emit = adaptor.connection.emit;
          expect(emit).to.be.calledWith("push", "data");
        });
      });
    });
  });
});
