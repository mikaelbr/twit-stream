# twit-stream [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][depstat-image]][depstat-url]

A simplification for reading Twitter data using Node.JS Streams.
Pass in OAuth info and select Twitter stream method, and get a
Node object mode stream returned.

## Usage and Installation

```sh
npm install --save twitter-stream
```

```javascript

var Twitter = require('twit-stream');

var options = {
  consumer_key: '',
  consumer_secret: '',
  oauth_token: '',
  oauth_secret: ''
};

var stream = new Twitter(options).filter({ track: 'Javascript' });

stream.pipe(objectHandler);
// Where objectHandler is an arbitrary write stream
```

*See [#examples](more examples)*

## Stream Endpoints

See information about the different end points on the Twitter Developer site

* [statuses/filter](https://dev.twitter.com/docs/api/1.1/post/statuses/filter)
* [statuses/sample](https://dev.twitter.com/docs/api/1.1/get/statuses/sample)
* [statuses/firehose](https://dev.twitter.com/docs/api/1.1/get/statuses/firehose)

## API

### `.filter(data)`
Parameter: `data` is request payload values (POST body) as documented by Twitter dev site.
Returns: `Stream` (with objectMode: true)

### `.sample(params)`
Parameter: `params` is values as documented by Twitter dev site
Returns: `Stream` (with objectMode: true)

### `.firehose(params)`
Parameter: `params` is values as documented by Twitter dev site
Returns: `Stream` (with objectMode: true)

**Note: You need special premissions by Twitter to have access to the firehose endpoint.**

## Examples 

```javascript

new Twitter(oauthOptions)
  .sample()
  // Convert from object mode stream to buffered stream
  .pipe(through.obj(function (obj, enc, next) {
    this.push(new Buffer(JSON.stringify(obj)) + endOfLine);
    next();
  }))
  // pipe to file
  .pipe(fs.createWriteStream(__dirname + '/sample.dat'));
```

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)

[npm-url]: https://npmjs.org/package/twit-stream
[npm-image]: https://badge.fury.io/js/twit-stream.png

[travis-url]: http://travis-ci.org/mikaelbr/twit-stream
[travis-image]: https://secure.travis-ci.org/mikaelbr/twit-stream.png?branch=master

[depstat-url]: https://david-dm.org/mikaelbr/twit-stream
[depstat-image]: https://david-dm.org/mikaelbr/twit-stream.png
