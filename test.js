/*global describe, it, require, __dirname*/
(function () {
  'use strict';

  var fs = require('fs'),
      util = require('util'),
      muk = require('muk'),
      queryStringify = require('querystring').stringify,
      Readable = require('stream').Readable || require('readable-stream/readable'),
      Stream = require('stream').Stream || require('readable-stream').Stream,
      OAuth = require('oauth'),
      EventEmitter = require('events').EventEmitter,
      Twitter = require('./');


  require('should');

  describe('Twitter', function() {
    describe('Constructor', function() {
      it('should take oauth information as parameter', function (done) {
        var t = getMock();

        t.options.should.have.property('consumer_key', '1');
        t.options.should.have.property('consumer_secret','2');
        t.options.should.have.property('oauth_token','3');
        t.options.should.have.property('oauth_secret','4');
        done();
      });

      it('should default to being in objectMode', function (done) {
        var t = getMock();
        t.options.should.have.property('objectMode', true);
        done();
      });

      it('should allow objectMode to be overridden', function (done) {
        var t = getMock({
          objectMode: false,
          consumer_key: '1',
          consumer_secret: '2',
          oauth_token: '3',
          oauth_secret: '4'
        });
        t.options.should.have.property('objectMode', false);
        done();
      });

      it('should throw error when not passing consumer key or secret', function (done) {
        (function(){
          var t = getMock({
            oauth_token: '3',
            oauth_secret: '4'
          });
        }).should.throw();
        done();
      });

      it('should throw error when not passing oauth token or secret', function (done) {
        (function(){
          var t = getMock({
            consumer_key: '1',
            consumer_secret: '2'
          });
        }).should.throw();
        done();
      });

    });

    describe('Api', function() {
      it('should have filter function', function (done) {
        getMock().should.have.property('filter');
        done();
      });

      it('should have sample function', function (done) {
        getMock().should.have.property('sample');
        done();
      });

      it('should have firehose function', function (done) {
        getMock().should.have.property('firehose');
        done();
      });
    });

    describe('Request', function () {
      it('should set queries if passing in params for sample', function (done) {
        var params = {
          'foo': 'bar'
        };
        var t = getMock(void 0, function (emitter) {
          return function (url, token, secret, data) {
            url.should.endWith(queryStringify(params));
            done();
            return emitter;
          };
        });

        t.sample(params);
      });

      it('should set queries if passing in params for firehose', function (done) {
        var params = {
          'foo': 'bar'
        };
        var t = getMock(void 0, function (emitter) {
          return function (url, token, secret, data) {
            url.should.endWith(queryStringify(params));
            done();
            return emitter;
          };
        });

        t.firehose(params);
      });

      it('should set request payload if passing in data into filter', function (done) {
        var expected = {
          'track': 'ninjas'
        };
        var t = getMock(void 0, function (emitter) {
          return function (url, token, secret, data) {
            data.should.equal(expected);
            done();
            return emitter;
          };
        });

        t.filter(expected);
      });
    });


    describe('Streaming', function () {

      before(function () {
        muk(OAuth, 'OAuth', function () { });
      });

      it('should return stream on sample', function (done) {
        var stream = getMock().sample();
        stream.should.have.property('pipe');
        stream.should.be.type('object');
        stream.should.be.an.instanceof(Stream);

        stream.destroy();
        done();
      });

      it('should return stream om filter', function (done) {
        var stream = getMock().filter();
        stream.should.have.property('pipe');
        stream.should.be.type('object');
        stream.should.be.an.instanceof(Stream);

        stream.destroy();
        done();
      });

      it('should return stream om firehose', function (done) {
        var stream = getMock().firehose();
        stream.should.have.property('pipe');
        stream.should.be.type('object');
        stream.should.be.an.instanceof(Stream);

        stream.destroy();
        done();
      });

      it('should return data as objects if objectMode (default behaviour)', function (done) {
        var stream = getMock().sample();
        var data = [];

        stream.on('data', function (obj) {
          obj.should.be.type('object');
          obj.should.have.property('created_at');
          data.push(obj);
        });

        stream.on('end', function () {
          data.length.should.equal(10);
          stream.destroy();
          done();
        });
      });

      it('should return data as string if objectMode:false', function (done) {
        var stream = getMock({
          objectMode: false,
          consumer_key: '1',
          consumer_secret: '2',
          oauth_token: '3',
          oauth_secret: '4'
        }).sample();
        var data = [];

        stream.on('data', function (obj) {
          obj.should.be.type('string');
          data.push(obj);
        });

        stream.on('end', function () {
          data.length.should.equal(10);
          stream.destroy();
          done();
        });
      });

      after(function () {
        muk.restore();
      });
    });

  });


  function TestReader() {
    Readable.apply(this);
    var data = JSON.stringify(require(__dirname + '/fixture/tweet.json')) + "\n";

    this._buffer = data;
    this._pos = 0;
    this._bufs = 10;
  }

  util.inherits(TestReader, Readable);

  TestReader.prototype._read = function(n) {
    var max = this._buffer.length - this._pos;
    n = Math.max(n, 0);
    var toRead = Math.min(n, max);
    if (toRead === 0) {
      // simulate the read buffer filling up with some more bytes some time
      // in the future.
      this._pos = 0;
      this._bufs -= 1;
      if (this._bufs <= 0) {
        // read them all!
        if (!this.ended)
          this.push(null);
      } else {
        // now we have more.
        // kinda cheating by calling _read, but whatever,
        // it's just fake anyway.
        this._read(n);
      }
      return;
    }

    var ret = this._buffer.slice(this._pos, this._pos + toRead);
    this._pos += toRead;
    if (this._bufs <= 1) {
      // no newline on last.
      ret = ret.substring(0, ret.length - 1);
    }
    this.push(ret);
  };


  function getMock (options, responseCreator) {
    var stream = getStreamMock();
    var emitter = new EventEmitter();

    emitter.end = function () {
      emitter.emit('response', stream);
    };

    options = options || {
      consumer_key: '1',
      consumer_secret: '2',
      oauth_token: '3',
      oauth_secret: '4'
    };

    responseCreator = responseCreator || function (emitter) {
      return function (url, token, secret, data) {
        return emitter;
      };
    };

    var t = new Twitter(options);

    muk(t.oauth, 'post', responseCreator(emitter));
    return t;
  }

  function getStreamMock (statusCode) {
    var stream = new TestReader();
    stream.statusCode = statusCode || 200;
    return stream;
  }

}());