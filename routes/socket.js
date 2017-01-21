var seatManager = require('../managers/seatManager.js');

// export function for listening to the socket
module.exports = function (socket) {
  
  //Initial socket emit
  socket.emit('init', {
    seats: [],
    numEmpty: 0,
    numFull: 0
  });

  //FrontEnd can call this socket to push some kind of data
  socket.on('receive:newConnection', function (data) {
    //Do something
    var clientInfo = {};
    clientInfo.client = socket;
    clientInfo.data = data;
    seatManager.connectNewClient(clientInfo);
  });

};
