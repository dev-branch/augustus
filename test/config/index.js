/* eslint no-unused-expressions: 0 */

'use strict';

var Chai = require('chai');
var Lab = require('lab');
var Config = require('../../lib/config');

var lab = exports.lab = Lab.script();
var describe = lab.experiment;
var expect = Chai.expect;
var it = lab.test;

describe('index.js', function(){
  it('no environment variables set', function(done){
    var env = Config.get();
    expect(env.NODE_ENV).to.equal('test');
    done();
  });

  it('all environment variables set', {parallel: false}, function(done){
    delete process.env.NODE_ENV;
    process.env.PORT = 3333;
    process.env.FIREBASE_SECRET = 'abc';
    process.env.FIREBASE_TOKEN = 'def';

    var env = Config.get();
    expect(env.NODE_ENV).to.equal('development');

    process.env.NODE_ENV = 'test';
    delete process.env.PORT;
    delete process.env.FIREBASE_SECRET;
    delete process.env.FIREBASE_TOKEN;
    done();
  });
});
