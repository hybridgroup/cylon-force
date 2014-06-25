"use strict";

var Adaptor = source('adaptor'),
    Commands = source('commands');

var Cylon = require('cylon'),
    NForce = require('nforce'),
    Faye = require('faye');

describe('Adaptor', function() {
  var adaptor = new Adaptor({
    extraParams: {
      orgCreds: 'orgCreds',
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

    it('defaults @fayeClient to null', function() {
      expect(adaptor.fayeClient).to.be.eql(null);
    });

    it('defaults @oauth to null', function() {
      expect(adaptor.oauth).to.be.eql(null);
    });

    it('sets @orgCreds to those passed in the device hash', function() {
      expect(adaptor.orgCreds).to.be.eql("orgCreds");
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
      sfCon = { authenticate: stub() };
      stub(NForce, 'createConnection').returns(sfCon);
      adaptor.connection = { emit: spy() };
    });

    afterEach(function() {
      NForce.createConnection.restore();
    });

    it("opens a SalesForce connection with NForce", function() {
      adaptor.connect(callback);
      expect(NForce.createConnection).to.be.calledWith(adaptor.orgCreds);
      expect(adaptor.sfCon).to.be.eql(sfCon);
    });

    it("attempts to authenticate with SalesForce", function() {
      var args = {
        username: 'user',
        password: 'pass'
      }

      adaptor.connect(callback);
      expect(sfCon.authenticate).to.be.calledWith(args)
    });

    context("if an error occuers while authenticating", function() {
      beforeEach(function() {
        stub(Cylon.Logger, 'error');
        sfCon.authenticate.yields("error message");
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
      var client, oauth;

      beforeEach(function() {
        client = { setHeader: spy() };
        oauth = { instance_url: "http://localhost:1234", access_token: "ABCD" };

        stub(Faye, 'Client').returns(client);

        sfCon.authenticate.yields(null, oauth);

        adaptor.connect(callback);
      });

      afterEach(function() {
        Faye.Client.restore();
      });

      it('sets @oauth to the oauth credentials', function() {
        expect(adaptor.oauth).to.be.eql(oauth)
      });

      it('sets up the Faye Client for Comet polling', function() {
        expect(Faye.Client).to.be.calledWith("http://localhost:1234/cometd/28.0");
        expect(adaptor.fayeClient).to.be.eql(client);
        expect(client.setHeader).to.be.calledWith("Authorization", "OAuth ABCD");
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
      adaptor.fayeClient = client;

      adaptor.subscribe("streampath", callback)
    });

    it("tells Faye to subscribe to the provided stream path", function() {
      expect(client.subscribe).to.be.calledWith("streampath", callback);
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
      it("uses the #apexRest NForce method to push data", function() {
        var args = { uri: 'uri', method: 'method', body: 'body' };
        adaptor.push('uri', 'method', 'body');
        expect(sfCon.apexRest).to.be.calledWith(args, oauth);
      });

      context("if the push returns an error", function() {
        beforeEach(function() {
          sfCon.apexRest.yields("error");
          adaptor.push();
        });

        it('emits the error via the connection', function() {
          var emit = adaptor.connection.emit;
          expect(emit).to.be.calledWith("error", "error");
        });
      });

      context("if the push returns data", function() {
        beforeEach(function() {
          sfCon.apexRest.yields(null, "data");
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
