var queueManager = require('../managers/queue_manager.js');

// export function for listening to the socket
module.exports = function (socket) {
  
  //Initial socket emit to set both queue and ticket to null
  socket.emit('init', {
    queue: null,
    ticket: null
  });

  //Function is called upon user entering the page
  //We map a new connection to the customerId
  socket.on('receive:customerid', function (customerId) {
    var jsonObj = {};
    jsonObj.client = socket;
    jsonObj.customerId = customerId;
    queueManager.connectNewClient(jsonObj);
  });

  //Send a call to backend to request a new ticket
  socket.on('receive:ticketrequest', function (customerId) {
    console.log("Data is = " + JSON.stringify(customerId));
    console.log("SOCKET ID = " + socket.id);
    var customerData = {
      customerId: customerId,
      clientId: socket.id
    }
    queueManager.createTicket(customerData);
  });
  


  socket.on('receive:merchantid', function (merchantId) {
    console.log("Received merchant id called " + "\n\n\n");
    var jsonObj = {};
    jsonObj.client = socket;
    jsonObj.customerId = merchantId;
    queueManager.connectNewMerchant(jsonObj);
  });
  socket.on('dequeue:nextticket', function (data) {
    queueManager.dequeueTicket();
  });
  socket.on('changetimeperticket:increment', function () {
    queueManager.incrementTimePerTicket();
  });
  socket.on('changetimeperticket:decrement', function () {
    queueManager.decrementTimePerTicket();
  });
  // socket.on('dequeue:specificticket', function (data) {
  //   queueManager.dequeueTicket();
  // });
};
