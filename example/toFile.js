var Twitter = require('../');
var fs = require('fs');
var through = require('through2');
var endOfLine = require('os').EOL;

var options = {
  consumer_key: '',
  consumer_secret: '',
  oauth_token: '',
  oauth_secret: ''
};

new Twitter(options)
  .sample()
  // Convert from object mode stream to buffered stream
  .pipe(through.obj(function (obj, enc, next) {
    this.push(new Buffer(JSON.stringify(obj)) + endOfLine);
    next();
  }))
  // pipe to file
  .pipe(fs.createWriteStream(__dirname + '/sample.dat'));