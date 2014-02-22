
"use strict";

var OAuth = require('oauth');
var streamify = require('streamify');
var querystring = require('querystring');
var split = require('split');
var OAUTH_BASE = 'https://api.twitter.com/oauth';

var url = {
  sample: 'https://stream.twitter.com/1.1/statuses/sample.json',
  firehose: 'https://stream.twitter.com/1.1/statuses/firehose.json',
  filter: 'https://stream.twitter.com/1.1/statuses/filter.json'
}

var Api = function (options) {
  if (!(this instanceof Api)) {
    return new Api(options);
  }

  if (!options.consumer_key || !options.consumer_secret) {
    throw new Error('Invalid arguments: Consumer key and Consumer secret is required');
  }

  if (!options.oauth_token || !options.oauth_secret) {
    throw new Error('Invalid arguments: OAuth token and OAuth secret is required');
  }

  this.options = options;
  this.oauth = new OAuth.OAuth(
        OAUTH_BASE + '/request_token',
        OAUTH_BASE + '/access_token',
        options.consumer_key, options.consumer_secret,
        '1.0A', null,'HMAC-SHA1'
      );
};

Api.prototype = {
  _request: function (url, data) {
    data = data || {};
    var stream = streamify({
      writable: false
    });
    var req = this.oauth.post(url, this.options.oauth_token, this.options.oauth_secret, data);
    return wrap(req, stream)
        .pipe(split(JSON.parse))
  },
  filter: function (data) {
    return this._request(url.filter, data);
  },
  sample: function (params) {
    return this._request(url.sample + extra(params));
  },
  firehose: function (params) {
    return this._request(url.firehose + extra(params));
  }
};

module.exports = Api;

function extra (params) {
  if (params) params = "?" + querystring.stringify(params);
  return params || '';
}

function wrap (req, stream) {
  req.on('response', function (response) {
    response.setEncoding('utf8');

    if (response.statusCode >= 200 && response.statusCode <= 299) {
      return stream.resolve(response);
    }

    stream.emit('error', new Error('Error code: ' + response.statusCode));
  });
  req.on('error', function (err) {
    stream.unresolve()
    stream.emit('error', err);
  });
  req.end();
  return stream;
}