var fs = require('fs');
var http = require('http');
var path = require('path');

var _ = require('lodash');
var packageJSON = require('./package.json');
var express = require('express');
var compression = require('compression');
var serveIndex = require('serve-index');
var WebSocket = require('faye-websocket');
var chokidar = require('chokidar');
var rewrite = require('connect-body-rewrite');
var commander = require('commander');

var ws;

module.exports = function (){

  var default_timeout = 0;
  var default_port = 3000;
  var default_root = '.';

  commander
    .version(packageJSON.version)
    .option('-t, --timeout [type]', 'timeout [' + default_timeout + ']', default_timeout)
    .option('-p, --port [type]', 'port [' + default_port + ']', default_port)
    .option('-r, --root [type]', 'root directory [' + default_root + '] (current directory)', default_root)
    .parse(process.argv);

  var client = fs.readFileSync(path.join(__dirname, 'client.html'), 'utf-8');

  var server = http.Server(express()
    .use(rewrite({
      accept: function (res) {
        return res.getHeader('content-type').match(/text\/html/);
      },
      rewrite: function (body) {
        return body.match('</body>') ? body.replace(/<\/body>/, client) : body + '\n' + client;
      }
    }))
    .use(express.static(commander.root))
    .use('/', serveIndex(commander.root, {'icons': true}))
    .use(compression()));

  server.addListener('upgrade', function (request, socket, head) {
    ws = new WebSocket(request, socket, head);
  });

  server.listen(commander.port);

  chokidar.watch(commander.root, {ignored: /[\/\\]\./}).on('all', _.debounce(function (event, path) {
    if (!ws) return;
    console.log(event, path);
    ws.send('reload');
  }, commander.timeout));

  console.log('rserv started...');
  console.log((commander.root === '.') ? __dirname : __dirname + '/' + commander.root);
  console.log('http://localhost:' + commander.port);
  console.log('timeout:' + commander.timeout);

};
