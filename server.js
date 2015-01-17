var fs = require('fs');
var http = require('http');
var path = require('path');

var _ = require('lodash');
var chokidar = require('chokidar');
var debounce = require('debounce');
var webSocket = require('socket.io').listen(1337);

module.exports = function(){

  'use strict';

  var args = require('minimist')(process.argv.slice(2));

  var options = _.extend(args, {
    port: 8080,
    socket: 1337,
    root: '.'
  });

  var client = _.template(fs.readFileSync(path.join(__dirname, 'client.html'), 'utf-8'), {
    socket: options.socket
  });

  http.createServer(require('connect')().
    use(require('compression')()).
    use(require('connect-body-rewrite')({
      accept: function(response) {
        return response.getHeader('content-type').match(/text\/html/);
      },
      rewrite: function(responseBody) {
        return responseBody.match('</body>') ?
          responseBody.replace(/<\/body>/, client) :
          responseBody + '\n' + client;
      }
    })).
    use(require('serve-static')(options.root))).listen(options.port);

  chokidar.watch(options.root, {
    ignoreInitial: true,
    persistent: true,
    ignored: /[\/\\]\./
  }).on('all', debounce(function(event, path){
    console.log('Reload');
    webSocket.emit('reload');
  }, 250));

  console.log('rserv started with the following options...\n', JSON.stringify(options, null, 2));

};