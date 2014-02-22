var Twitter = require('../');

var options = {
  consumer_key: '',
  consumer_secret: '',
  oauth_token: '',
  oauth_secret: ''
};

var stream = new Twitter(options).filter({ track: 'hello' });

stream
  // Stream is now a object moded stream of Twitter data
  .on('data', function (obj) {
    console.log(obj);
  })
  .on('error', function (err) {
    console.log("Error", err)
  });
