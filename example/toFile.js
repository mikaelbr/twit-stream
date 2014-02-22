var Twitter = require('../');
var fs = require('fs');

var options = {
  objectMode: false, // Get data as buffers

  consumer_key: '',
  consumer_secret: '',
  oauth_token: '',
  oauth_secret: ''
};

new Twitter(options).sample()
  // pipe to file
  .pipe(fs.createWriteStream(__dirname + '/sample.dat'));