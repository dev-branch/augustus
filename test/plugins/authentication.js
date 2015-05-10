/* eslint no-unused-expressions: 0 */

'use strict';

var Chai = require('chai');
var Lab = require('lab');
var Server = require('../../lib/server');
var Mongoose = require('mongoose');
var User = require('../../lib/models/user');

var lab = exports.lab = Lab.script();
var describe = lab.experiment;
var expect = Chai.expect;
var it = lab.test;

describe('authentication.js', function(){
  it('token is expired', function(done){
    Server.init(function(serverErr, server){
      expect(serverErr).to.be.undefined;
      server.plugins.authentication.authenticate.validateFunc({}, function(authErr, isAuth, credentials){
        expect(authErr).to.be.undefined;
        expect(credentials).to.be.undefined;
        Mongoose.disconnect(done);
      });
    });
  });

  it('token is NOT expired', function(done){
    Server.init(function(serverErr, server){
      expect(serverErr).to.be.undefined;
      var iat = (Date.now() / 1000) - 5;
      server.plugins.authentication.authenticate.validateFunc({iat: iat, d: {uid: 'fake'}}, function(authErr, isAuth, credentials){
        expect(authErr).to.be.null;
        expect(credentials.firebaseId).to.equal('fake');
        Mongoose.disconnect(done);
      });
    });
  });

  it('database error', {parallel: false}, function(done){
    Server.init(function(serverErr, server){
      expect(serverErr).to.be.undefined;
      var iat = (Date.now() / 1000) - 5;
      var findOne = User.findOne;
      User.findOne = function(query, cb){
        cb(new Error('db error'));
      };
      server.plugins.authentication.authenticate.validateFunc({iat: iat, d: {uid: 'fake'}}, function(authErr, isAuth, credentials){
        expect(authErr).to.not.be.ok;
        expect(credentials).to.not.be.ok;
        User.findOne = findOne;
        Mongoose.disconnect(done);
      });
    });
  });

  it('user is found', {parallel: false}, function(done){
    Server.init(function(serverErr, server){
      expect(serverErr).to.be.undefined;
      var iat = (Date.now() / 1000) - 5;
      var findOne = User.findOne;
      User.findOne = function(query, cb){
        cb(null, {_id: 3});
      };
      server.plugins.authentication.authenticate.validateFunc({iat: iat, d: {uid: 'fake'}}, function(authErr, isAuth, credentials){
        expect(authErr).to.not.be.ok;
        expect(credentials._id).to.equal(3);
        User.findOne = findOne;
        Mongoose.disconnect(done);
      });
    });
  });
});
