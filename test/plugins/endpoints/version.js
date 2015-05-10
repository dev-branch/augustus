/* eslint no-unused-expressions: 0 */

'use strict';

var Chai = require('chai');
var Lab = require('lab');
var Server = require('../../../lib/server');
var Mongoose = require('mongoose');

var lab = exports.lab = Lab.script();
var describe = lab.experiment;
var expect = Chai.expect;
var it = lab.test;

describe('GET /version', function(){
  it('get app version', function(done){
    Server.init(function(err, server){
      server.inject({method: 'get', url: '/version', headers: {authorization: 'Bearer ' + server.app.environment.FIREBASE_TOKEN}}, function(res){
        expect(err).to.not.be.ok;
        expect(res.statusCode).to.equal(200);
        Mongoose.disconnect(done);
      });
    });
  });
});
