/* eslint no-unused-expressions: 0 */

'use strict';

var Chai = require('chai');
var Lab = require('lab');
var Server = require('../lib/server');
var Version = require('../lib/plugins/endpoints/version');
var Mongoose = require('mongoose');

var lab = exports.lab = Lab.script();
var describe = lab.experiment;
var expect = Chai.expect;
var it = lab.test;

describe('server.js', function(){
  it('creates a server', function(done){
    Server.init(function(err, server){
      expect(err).to.be.undefined;
      expect(server).to.be.ok;
      Mongoose.disconnect(done);
    });
  });

  it('fails plugin registration', {parallel: false}, function(done){
    var register = Version.register;

    Version.register = function(server, options, next){
      return next(new Error('plugin error'));
    };
    Version.register.attributes = {
      name: 'bad version'
    };

    Server.init(function(err, server){
      expect(err).to.be.ok;
      expect(server).to.be.undefined;
      Version.register = register;
      Mongoose.disconnect(done);
    });
  });
});
