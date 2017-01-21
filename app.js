'use strict';

/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');

var socket = require('./routes/socket.js');
var seatManager = require('./managers/seatManager.js');

var app = express();
var server = http.createServer(app);

/* Configuration */
app.set('views', __dirname + '/views');
app.use(express.static(__dirname));
app.set('port', (process.env.PORT || 5000));
// app.use(function(req, res){
//   console.log(JSON.stringify(req));
//    res.redirect('/public');
// });
app.get('/update-solo-seat', function(req, res) {
  res.send('Update seat called');
  var seatIndex = req.query.id;
  var isEmpty = req.query.empty;
  seatManager.updateSeatVancancy(seatIndex, isEmpty);
});

app.use(redirectUnmatched);
function redirectUnmatched(req, res) {
  // res.send('Error 404 : Page not found');
  res.redirect("/public");
}

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
