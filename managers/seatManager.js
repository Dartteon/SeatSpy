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
        numEmptySeats: numEmptySeats,
        numFullSeats: numFullSeats
    }
    dbManager.saveData(data);
}

function getSeatDataHighChart(request, response, next) {
    var startDateTime = request.query["startDateTime"];
    var endDateTime = request.query["endDateTime"];
    endDateTime = new Date();
    startDateTime = new Date();
    startDateTime.setDate(startDateTime.getDate()-1);

    dbManager.getData(startDateTime, endDateTime,
        function (result) {
            var graphs = generateGraphs(result);
            // console.log(JSON.stringify(result));
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
    graphs.push({"name": "Occupied Seats", "data": numFullArray, type: 'spline', color: '#C0392B'});
    graphs.push({"name": "Empty Seats", "data": numEmptyArray, type: 'spline', color: '#2ECC71'});
    graphs.push({"name": "% Seats Occupied", "data": rateArray, type: 'spline', color: '#F1C40F'});
    return graphs;
}
function generateHighChartJson(graphs, data) {
    //Construct highchart JSON for return
    var highChartJson = {};
    highChartJson.title = {
      "text": "Seat Occupancy Rate",
      y: 25,
      x: 0,
      style: {
        color: '#CCC'
      }
    };
    highChartJson.xAxis = {
      "categories": "Time",
      labels: {
        style: {
          color: '#CCC'
        }
      },
      gridLineColor: '#85d5ca'
    };
    highChartJson.yAxis = {
        title: {
            text: "Number",
            style: {
              color: '#CCC'
            }
        },
        labels: {
          style: {
            color: '#CCC'
          }
        },
        plotLines: [{
            value: 0,
            width: 1,
            color: '#CCC'
        }]
    }
    highChartJson.legend = {
        layout: 'horizontal',
        align: 'center',
        verticalAlign: 'bottom',
        borderWidth: 0,
        itemStyle: {
          color: '#CCC'
        },
        itemHoverStyle: {
           color: '#CCC'
        },
        itemHiddenStyle: {
           color: '#444'
        }
    }
    highChartJson.chart = {
      backgroundColor: null
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
