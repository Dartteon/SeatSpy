var dbManager = require('./dbManager.js');
const router = require('express').Router();

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
        seats: buildSeatColorArray(),
        numEmpty: numEmptySeats,
        numFull: numFullSeats
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
        seats: buildSeatColorArray(),
        numEmpty: numEmptySeats,
        numFull: numFullSeats
    }
    
    //Send data
    for (var i = 0; i < clients.length; i++) {
        clients[i].emit('send:data', data);
    }
}

function buildSeatColorArray() {
    //Very bad design, I know
    colors = [];
    for (var i = 0; i < seats.length; i++) {
        if (!!seats[i]) colors.push("empty-seats-color");
        else colors.push("occupied-seats-color");
    }
    return colors;
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
        seats: buildSeatColorArray(),
        numEmpty: numEmptySeats,
        numFull: numFullSeats
    }
    dbManager.saveData(data);
}

function getSeatDataHighChart(request, response, next) {
    var startDateTime = request.query["startDateTime"];
    var endDateTime = request.query["endDateTime"];
    dbManager.getData(startDateTime, endDateTime,
        function (result) {
            var graphs = generateGraphs(result);
            var highChart = generateHighChartJson(graphs, result);
            // next(highChart);
            response.end(JSON.stringify(highChart));
        });
}

function generateGraphs(data) {
    var numFullArray = [];
    var numEmptyArray = [];
    var rateArray = [];

    for (var i = 0; i < data.length; i++) {
        var numFull = data[i].numFullSeats;
        var numEmpty = data[i].numEmptySeats;
        var ratio = 100 * numFull / (numFull + numEmpty);
        numFullArray.push(numFull);
        numEmptyArray.push(numEmpty);
        rateArray.push(ratio);
    }

    var graphs = [];
    graphs.push({"name": "Occupied Seats", "data": numFullArray, type: 'spline'});
    graphs.push({"name": "Empty Seats", "data": numEmptyArray, type: 'spline'});
    graphs.push({"name": "% Seats Occupied", "data": rateArray, type: 'spline'});
}
function generateHighChartJson(graphs, data) {
    //Construct highchart JSON for return
    var highChartJson = {};
    highChartJson.title = { "text": "Seat Data", y: 25, x: 0 };
    highChartJson.subtitle = { "text": "", y: 45};
    highChartJson.xAxis = { "categories": "Time" };
    highChartJson.yAxis = {
        title: {
            text: "Number"
        },
        plotLines: [{
            value: 0,
            width: 1,
            color: '#808080'
        }]
    }
    highChartJson.legend = {
        layout: 'horizontal',
        align: 'center',
        verticalAlign: 'bottom',
        borderWidth: 0
    }
    highChartJson.series = graphs;
    return highChartJson;
}

module.exports = {
    initialize: initialize,
    updateAllClients: updateAllClients,
    connectNewClient: connectNewClient,
    updateSeatVancancy: updateSeatVancancy,
    saveSeatData: saveSeatData,
    getSeatDataHighChart: getSeatDataHighChart
}