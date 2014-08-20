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

    afterEach(function() {
      JSForce.Connection.restore();
    });

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
    var client, subscription, callback, emit, sfCon, streamer, topic;

    beforeEach(function() {
      topic = {subscribe: stub()}
      streamer = {topic: stub().returns(topic)}
      sfCon = adaptor.sfCon = { streaming: streamer };
      callback = spy();

      adaptor.subscribe("mytopic", callback)
    });

    it("tells jsforce to subscribe to the provided topic", function() {
      expect(streamer.topic).to.be.calledWith("mytopic");
    });
  });

  describe("#push", function() {
    var sfCon, apexer, poster;

    beforeEach(function() {
      poster = stub()
      apexer = { post: poster }
      sfCon = adaptor.sfCon = { apex: apexer };
      adaptor.connection = { emit: spy() };
    });

    context("if not authenticated", function() {
      beforeEach(function() {
        adaptor.userInfo = null;
      });

      it("auth status must be false", function() {
        expect(adaptor.push()).to.be.false;
      });

      it("cannot use the #apex JSForce method to post data", function() {
        adaptor.push('uri', 'body')
        expect(poster).to.not.be.called;
      });
    });

    context("if authenticated", function() {
      beforeEach(function() {
        adaptor.userInfo = {username: "Ada"}
      });

      it("auth status must be true", function() {
        expect(adaptor.push()).to.be.true;
      });

      it("uses the #apex JSForce method to post data", function() {
        adaptor.push('uri', 'body')
        expect(poster).to.be.called;
      });
    });
  });
});
