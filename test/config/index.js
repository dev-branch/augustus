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
  it('environment variables erased', function(done){
    var origEnv = process.env;
    process.env = {};
    var env = Config.get();
    expect(env.NODE_ENV).to.equal('development');
    process.env = origEnv;
    done();
  });

  it('set port environment variables', function(done){
    var origEnv = process.env;
    process.env = {};
    process.env.PORT = 3333;
    var env = Config.get();
    expect(env.PORT).to.equal(3333);
    process.env = origEnv;
    done();
  });
});
