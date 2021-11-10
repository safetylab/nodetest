const http = require('http');
var strftime = require('strftime');
var accesslog = require('access-log');

var count=0;

var hostname=process.env.TEST_HOST || '0.0.0.0';
var port=process.env.TEST_PORT || 3001;
const fs = require('fs');
const myaccess = new console.Console(fs.createWriteStream('./access.log'));
var defaultformat = ':ip - :userID [:clfDate] ":method :url :protocol/:httpVersion" :statusCode :contentLength ":referer" ":userAgent"';

function basiAuthUserID(req) {
  return new Buffer(req.headers.authorization.split(' ')[1], 'base64').toString().split(':')[0];
}

// replace :variable and :{variable} in `s` with what's in `d`
function template(s, d) {
  s = s.replace(/(:[a-zA-Z]+)/g, function(match, key) {
    return d[key] || '';
  });
  return s.replace(/:{([a-zA-Z]+)}/g, function(match, key) {
    return d[':' + key] || '';
  });
}

// make a string safe to put in double quotes in CLF
function encode(s) {
  return s.replace(/\\/g, '\\x5C').replace(/"/, '\\x22');
}

var uriDecoded;
  try {
    uriDecoded = decodeURIComponent(req.url);
  } catch (e) {
    uriDecoded = e.message || 'error decoding URI';
  }

const server = http.createServer((req, res) => {
    if (req.url == '/') { //check the URL of the current request
    var remoteAddress = req.connection.remoteAddress;
    var start = new Date();
    var end = new Date();
    var delta = end - start;
    var data = {
      ':clfDate': strftime('%d/%b/%Y:%H:%M:%S %z', end),
      ':delta': delta,
      ':endDate': end.toISOString(),
      ':endTime': end.getTime(),
      ':host': encode(req.headers.host || '-'),
      ':httpVersion': req.httpVersion,
      ':ip': remoteAddress || '-',
      ':Xip': encode(req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || remoteAddress || '-'),
      ':method': req.method,
      ':protocol': req.connection.encrypted ? 'HTTPS' : 'HTTP',
      ':referer': encode(req.headers.referer || '-'),
      ':startDate': start.toISOString(),
      ':startTime': start.getTime(),
      ':statusCode': res.statusCode,
      ':url': encode(req.url),
      ':urlDecoded': encode(uriDecoded),
      ':userAgent': encode(req.headers['user-agent'] || '-')
    };
        myaccess.log(template(defaultformat, data));
        res.writeHead(200, { 'Content-Type': 'text/html' }); 
        res.write('<html><body><p>Thanks you google.com</p></body></html>');
	const myConsole = new console.Console(fs.createWriteStream('./count.txt'));
        myConsole.log(count);
        res.end('Count '+count++);
    }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
