var fs = require('fs');
var http = require('http');
var path = require('path');

var _ = require('lodash');
var packageJSON = require('./package.json');
var express = require('express');
var compression = require('compression');
var serveIndex = require('serve-index');
var socketIO = require('socket.io');
var chokidar = require('chokidar');
var rewrite = require('connect-body-rewrite');
var commander = require('commander');

module.exports = function(){

  var default_port = 3000;
  var default_root = '.';

  commander
    .version(packageJSON.version)
    .option('-p, --port [type]', 'port [' + default_port + ']', default_port)
    .option('-r, --root [type]', 'root directory [' + default_root + '] (current directory)', default_root)
    .parse(process.argv);

  var client = _.template(fs.readFileSync(path.join(__dirname, 'client.html'), 'utf-8'))({
    port: commander.port
  });

  var server = http.Server(express()
    .use('/', serveIndex(commander.root, {'icons': true}))
    .use(rewrite({
      accept: function (res) {
        return res.getHeader('content-type').match(/text\/html/);
      },
      rewrite: function (body) {
        return body.match('</body>') ? body.replace(/<\/body>/, client) : body + '\n' + client;
      }
    }))
    .use(express.static(commander.root))
    .use(compression()));

  var io = socketIO(server);

  chokidar.watch(commander.root, {ignored: /[\/\\]\./}).on('all', _.debounce(function(event, path) {
    console.log(event, path);
    io.emit('reload');
  }, 250));

  server.listen(commander.port);

  console.log('rserv started...');
  console.log((commander.root === '.') ? __dirname : __dirname + '/' + commander.root);
  console.log('http://localhost:' + commander.port);

};
