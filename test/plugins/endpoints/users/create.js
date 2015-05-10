/* eslint no-unused-expressions: 0 */

'use strict';

var Chai = require('chai');
var Lab = require('lab');
var Server = require('../../../../lib/server');
var Mongoose = require('mongoose');
var User = require('../../../../lib/models/user');

var lab = exports.lab = Lab.script();
var describe = lab.experiment;
var expect = Chai.expect;
var it = lab.test;
var before = lab.before;
var after = lab.after;
var beforeEach = lab.beforeEach;

var server;

describe('POST /users', function(){
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

  beforeEach(function(done){
    User.remove(done);
  });

  it('create a user', function(done){
    server.inject({method: 'post', url: '/users', headers: {authorization: 'Bearer ' + server.app.environment.FIREBASE_TOKEN}}, function(res){
      expect(res.statusCode).to.equal(200);
      expect(res.result.toString()).to.have.length(24);
      done();
    });
  });

  it('finds a user', function(done){
    server.inject({method: 'post', url: '/users', credentials: {_id: 3}}, function(res){
      expect(res.statusCode).to.equal(200);
      expect(res.result).to.equal(3);
      done();
    });
  });
});
