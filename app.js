'use strict';

/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');

var socket = require('./routes/socket.js');
var queueManager = require('./managers/queue_manager.js');

var app = express();
var server = http.createServer(app);

/* Configuration */
app.set('views', __dirname + '/views');
app.use(express.static(__dirname));
app.set('port', (process.env.PORT || 5000));
app.use(function(req, res){
   res.redirect('/public');
});

// const adminRoute = require('./routes/admin');
// app.use(adminRoute);

/* Socket.io Communication */
var io = require('socket.io').listen(server);
io.sockets.on('connection', socket);

io.sockets.on('connect', function (client) {
});

/* Start server */
server.listen(app.get('port'), function () {
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

module.exports = app;
