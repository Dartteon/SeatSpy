'use strict';

const secret = require('./config.json')[process.env.NODE_ENV || 'development'];
var express = require('express');
var http = require('http');
const mongoose = require('mongoose');

var socket = require('./routes/socket.js');
var seatManager = require('./managers/seatManager.js');
var cronManager = require('./managers/cronManager.js');

var app = express();
var server = http.createServer(app);

/* Configuration */
app.set('views', __dirname + '/views');
app.use(express.static(__dirname));
app.set('port', (process.env.PORT || 5000));

app.get('/update-solo-seat', function(req, res) {
  //API endpoint for sensor devices to make HTTP requests to
  res.send('Update seat called');
  var seatIndex = req.query.id;
  var isEmpty = req.query.empty;
  seatManager.updateSeatVancancy(seatIndex, isEmpty);
});

const mainRoutes = require('./routes/mainRoutes.js');
app.use(mainRoutes);
// app.use(redirectUnmatched);
function redirectUnmatched(req, res) {
  //Redirect all requests (except sensor HTTP requests) to /public
  res.redirect("/public");
}

mongoose.connect(secret.database, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Connected to database!');
  }
});

/* Socket.io Communication */
var io = require('socket.io').listen(server);
io.sockets.on('connection', socket);

io.sockets.on('connect', function (client) {
});


/* Start server */
server.listen(app.get('port'), function () {
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
  cronManager.startAllCronjobs();
});

module.exports = app;
