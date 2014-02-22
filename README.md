# twit-stream [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][depstat-image]][depstat-url]

A simplification for reading Twitter data using Node.JS Streams.
Pass in OAuth info and select Twitter stream method, and get a
Node stream2 returned. Choose whether you want a stream of objects
(objectMode: true) or a stream of buffers.

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

*See [more examples](#examples)*

## Stream Endpoints

See information about the different end points on the Twitter Developer site

* [statuses/filter](https://dev.twitter.com/docs/api/1.1/post/statuses/filter)
* [statuses/sample](https://dev.twitter.com/docs/api/1.1/get/statuses/sample)
* [statuses/firehose](https://dev.twitter.com/docs/api/1.1/get/statuses/firehose)

## API

### `new Twitter(options)`
Parameter: `option` is object of options.  
Returns: `Twitter` instance

Options must contain OAuth info
```json
{
  "consumer_key": "",
  "consumer_secret": "",
  "oauth_token": "",
  "oauth_secret": ""
}
```

In addition to OAuth data, options allow you to define if the
returned streams should be in objectMode or not.

#### `options.objectMode`
Type: `Boolean`  
Default: `true`

With object mode the data passed is a stream of Twitter objects.
By setting the `objectMode` to false, the streamed data is a
stream of buffered strings, one tweet buffered up at the time.

`objectMode: false` could be used to pipe twitter data directly
to file or to any other write stream requiering buffers.

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
options.objectMode = false;
new Twitter(options).sample()
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
