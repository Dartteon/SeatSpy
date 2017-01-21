var dbManager = require('./dbManager.js');

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
    var numEmptySeats = 0;
    for (var j = 0; j < seats.length; j++) {
        if (seats[j] == true) numEmptySeats++;
    }
    var numFullSeats = seats.length - numEmptySeats;
    var data = {
        seats: seats,
        numEmptySeats: numEmptySeats,
        numFullSeats: numFullSeats
    }

    //Send data
    client.emit('send:data', data);
}

function updateAllClients() {
    //Build data
    var numEmptySeats = 0;
    for (var j = 0; j < seats.length; j++) {
        // console.log("Index " + j + " " + seats[j] + " bool - " + (!!seats[j]));
        if (!!seats[j]) numEmptySeats++;
    }
    var numFullSeats = seats.length - numEmptySeats;
    console.log("Current State --- numEmptySeats[" + numEmptySeats + "] --- numFullSeats[" + numFullSeats + "] --- Seats[" + seats + "]");

    var data = {
        seats: seats,
        numEmptySeats: numEmptySeats,
        numFullSeats: numFullSeats
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

function saveSeatData() {
    //Build data
    var numEmptySeats = 0;
    for (var j = 0; j < seats.length; j++) {
        // console.log("Index " + j + " " + seats[j] + " bool - " + (!!seats[j]));
        if (!!seats[j]) numEmptySeats++;
    }
    var numFullSeats = seats.length - numEmptySeats;
    console.log("Current State --- numEmptySeats[" + numEmptySeats + "] --- numFullSeats[" + numFullSeats + "] --- Seats[" + seats + "]");

    var data = {
        seats: seats,
        numEmptySeats: numEmptySeats,
        numFullSeats: numFullSeats
    }
    dbManager.saveData(data);
}

module.exports = {
    initialize: initialize,
    updateAllClients: updateAllClients,
    connectNewClient: connectNewClient,
    updateSeatVancancy: updateSeatVancancy,
    saveSeatData: saveSeatData
}