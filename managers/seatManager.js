
var clients = [];
var seats = [true, true, true, true, 
    true, true, true, true];

function initialize() {

}

function connectNewClient (clientInfo) {
    var client = clientInfo.client;
    // var clientId = client.id;
    clients.push(client);
    console.log ("New client added --- TotalClients=" + clients.length);
    client.on('disconnect', function () {
        clients.splice(clients.indexOf(client), 1);
        console.log("Client disconnected --- TotalClients=" + clients.length);
    });
    
    //Build data
    var numEmpty = 0;
    for (var j = 0; j < seats.length; j++) {
        if (seats[j] == true) numEmpty++;
    }
    var numFull = seats.length - numEmpty;
    var data = {
        seats: seats,
        numEmpty: numEmpty,
        numFull: numFull
    }

    //Send data
    client.emit('send:data', data);
}

function updateAllClients() {
    //Build data
    var numEmpty = 0;
    for (var j = 0; j < seats.length; j++) {
        // console.log("Index " + j + " " + seats[j] + " bool - " + (!!seats[j]));
        if (!!seats[j]) numEmpty++;
    }
    var numFull = seats.length - numEmpty;
    console.log("Current State --- NumEmpty[" + numEmpty + "] --- NumFull[" + numFull + "] --- Seats[" + seats + "]");

    var data = {
        seats: seats,
        numEmpty: numEmpty,
        numFull: numFull
    }
    
    //Send data
    for (var i = 0; i < clients.length; i++) {
        clients[i].emit('send:data', data);
    }
}

function updateSeatVancancy (seatIndex, isEmpty) {
    isEmpty = JSON.parse(isEmpty);  //Ensure variable is boolean
    if (seats.length - 1 < seatIndex) {
        console.log ("ERROR : Seat index is out of range - [" + seatIndex + "]");
        return;
    }

    if (seats[seatIndex] == isEmpty) {
        console.log("Seat Index [" + seatIndex + "] updating when its not supposed to?");
        return;
    }
    seats[seatIndex] = isEmpty;
    updateAllClients();
}

module.exports = {
    initialize: initialize,
    updateAllClients: updateAllClients,
    connectNewClient: connectNewClient,
    updateSeatVancancy: updateSeatVancancy
}