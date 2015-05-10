/* eslint no-unused-expressions: 0 */

'use strict';

var Chai = require('chai');
var Lab = require('lab');
var Server = require('../../lib/server');
var Mongoose = require('mongoose');
var User = require('../../lib/models/user');
var Sinon = require('sinon');

var lab = exports.lab = Lab.script();
var describe = lab.experiment;
var expect = Chai.expect;
var it = lab.test;
var before = lab.before;
var after = lab.after;

var server;

describe('authentication.js', function(){
  before(function(done){
    Server.init(function(err, srvr){
      if(err){ throw err; }
      server = srvr;
      done();
    });
  });

  after(function(done){
    server.stop(function(){
      Mongoose.disconnect(done);
    });
  });

  it('token is expired', function(done){
    server.plugins.authentication.authenticate.validateFunc({}, function(err, isAuth, credentials){
      expect(err).to.be.undefined;
      expect(credentials).to.be.undefined;
      done();
    });
  });

  it('token is NOT expired', function(done){
    var iat = (Date.now() / 1000) - 5;
    server.plugins.authentication.authenticate.validateFunc({iat: iat, d: {uid: 'fake'}}, function(err, isAuth, credentials){
      expect(err).to.be.null;
      expect(credentials.firebaseId).to.equal('fake');
      done();
    });
  });

  it('database error', function(done){
    var iat = (Date.now() / 1000) - 5;
    var stub = Sinon.stub(User, 'findOne').yields(new Error());
    server.plugins.authentication.authenticate.validateFunc({iat: iat, d: {uid: 'fake'}}, function(err, isAuth, credentials){
      expect(err).to.not.be.ok;
      expect(credentials).to.not.be.ok;
      stub.restore();
      done();
    });
  });

  it('user is found', function(done){
    var iat = (Date.now() / 1000) - 5;
    var stub = Sinon.stub(User, 'findOne').yields(null, {_id: 3});
    server.plugins.authentication.authenticate.validateFunc({iat: iat, d: {uid: 'fake'}}, function(authErr, isAuth, credentials){
      expect(authErr).to.not.be.ok;
      expect(credentials._id).to.equal(3);
      stub.restore();
      done();
    });
  });
});
