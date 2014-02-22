/*global describe, it*/
"use strict";


var fs = require('fs'),
    Twitter = require('./');


require('should');

describe('Twitter', function() {
  describe('Constructor', function() {
    it('should take oauth information as parameter', function (done) {
      var t = new Twitter({
        consumer_key: '1',
        consumer_secret: '2',
        oauth_token: '3',
        oauth_secret: '4'
      });

      t.options.should.have.property('consumer_key', '1');
      t.options.should.have.property('consumer_secret','2');
      t.options.should.have.property('oauth_token','3');
      t.options.should.have.property('oauth_secret','4');
      done();
    });

    it('should throw error when not passing consumer key or secret', function (done) {
      (function(){
        var t = new Twitter({
          oauth_token: '3',
          oauth_secret: '4'
        });
      }).should.throw();
      done();
    });

    it('should throw error when not passing oauth token or secret', function (done) {
      (function(){
        var t = new Twitter({
          consumer_key: '1',
          consumer_secret: '2'
        });
      }).should.throw();
      done();
    });

  });

  describe('Api', function() {
    before(function () {
      this.t = new Twitter({
        consumer_key: '1',
        consumer_secret: '2',
        oauth_token: '3',
        oauth_secret: '4'
      });
    });

    it('should have filter function', function (done) {
      this.t.should.have.property('filter');
      done();
    });

    it('should have sample function', function (done) {
      this.t.should.have.property('sample');
      done();
    });

    it('should have firehose function', function (done) {
      this.t.should.have.property('firehose');
      done();
    });
  });

  // @TODO: more real tests

});