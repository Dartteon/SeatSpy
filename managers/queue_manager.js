var uuid = require('uuid');
// var config = require('../config.json');
// var twilioClient = require('../twilioClient');

var queue = [];
// var clients = [];
var currTicketNum = 1;

var custClients = {};

var merchantClients = [];

var clientIdToTicket = {};
var custIdToClientId = {};  //Maps customerId to client
var clientIdToCustId = {};  //Maps clientId to custId
var custIdToTicket = {};    //Maps custId to current ticket

function connectNewClient(data) {
    var client = data.client;
    var clientId = client.id;
    custClients[clientId] = client;
    console.log("Client pushed.. num clients in list = " + Object.keys(custClients).length);
    client.on('disconnect', function () {
        delete custClients[client.id];
    });

    var customerId = data.customerId;
    if (custIdToTicket[customerId]) {
        //customer has existing ticket
        clientIdToCustId[clientId] = customerId;
        custIdToClientId[customerId] = clientId;
        clientIdToTicket[clientId] = custIdToTicket[customerId];
    }
    updateAllClients();
}

function connectNewMerchant(data) {
    var client = data.client;
    var clientId = client.id;
    merchantClients.push(client);
    client.on('disconnect', function () {
        merchantClients.splice(merchantClients.indexOf(client), 1);
    });
    updateAllClients();
}

function createTicket(customerData) {
    console.log("Customer data received " + JSON.stringify(customerData));
    var customerId = customerData.customerId;
    var clientId = customerData.clientId;
    var customerPhone = customerData.customerPhone;
    if (customerId == null || customerId == undefined || customerId == "undefined") {
        //Customer is new - generate a new UUID for him!
        customerId = uuid.v4();
        console.log("Generated new UUID for customer " + customerId + "\n\n\n");
    }
    if (clientIdToTicket[clientId]) {
        //Client has already requested for a ticket before
        console.log("Customer client has already requested for ticket before");
        return;
    }
    if (custIdToTicket[customerId]) {
        //customer already has a ticket!
        var existingTicket = custIdToTicket[customerId];
        clientIdToCustId[clientId] = customerId;
        clientIdToTicket[clientId] = existingTicket;
        updateAllClients();
        return;
    }
    var ticketNum = formatTicketNumber(currTicketNum++);
    var newTicket = {
        ticket_num: ticketNum,
        customer_id: customerId,
        client_id: clientId,
        customer_phone: customerPhone
    }
    clientIdToTicket[clientId] = newTicket;
    custIdToTicket[customerId] = newTicket;
    custIdToClientId[customerId] = clientId;
    clientIdToCustId[clientId] = customerId
    queue.push(newTicket);
    console.log("New ticket created = " + JSON.stringify(newTicket));

    // console.log("clientIdToTicket\n" + JSON.stringify(clientIdToTicket) + "\n\n");
    // console.log("custIdToClientId\n" + JSON.stringify(custIdToClientId) + "\n\n");
    // console.log("clientIdToCustId\n" + JSON.stringify(clientIdToCustId) + "\n\n");
    // console.log("custIdToTicket\n" + JSON.stringify(custIdToTicket) + "\n\n");

    updateAllClients();
    // dequeueTicket();
}

function updateAllClients() {
    var clientKeys = Object.keys(custClients);
    for (var i = 0; i < clientKeys.length; i++) {
        var client = custClients[clientKeys[i]];
        console.log("Looping client " + client.id);

        var clientId = client.id;
        console.log(JSON.stringify(clientIdToCustId) + "\n");
        var custId = clientIdToCustId[clientId];
        if (custId) {
            console.log("Client has valid ticket");
            //client has valid ticket
            var ticket = clientIdToTicket[clientId];
            var indexInQueue = queue.indexOf(ticket);
            var remainingTime = timePerTicket * (indexInQueue + 1);
            ticket.est_wait_time = remainingTime;
            ticket.num_in_front = indexInQueue;
            ticket.num = (indexInQueue < 0) ? "Your Turn!" : ticket.num;
            client.emit('send:ticket', ticket);
        }
        else {
            console.log("Client not mapped to ticket - custId = " + custId);
            var emittedQueue = {
                num_in_front: queue.length,
                est_wait_time: timePerTicket * (queue.length + 1)
            };
            client.emit('send:queue', emittedQueue);
        }
    }

    for (var i = 0; i < merchantClients.length; i++) {
        var totalCustInQueue = queue.length;
        var totalWaitingTime = totalCustInQueue * timePerTicket;
        var currTicketNum = (queue[0]) ? queue[0].ticket_num : "/";
        var merchantData = {
            total_cust_in_queue: totalCustInQueue,
            total_est_waiting_time: totalWaitingTime,
            time_per_ticket: timePerTicket,
            next_ticket_num: currTicketNum
        }
        merchantClients[i].emit('send:merchantdata', merchantData);
    }
}


/*  =============================================
    Admin functions
    =========================================== */

var timePerTicket = 10;
function decrementTimePerTicket() {
    timePerTicket = timePerTicket - 1;
    if (timePerTicket < 0) {
        timePerTicket = 0;
    }
    updateAllClients();
}
function incrementTimePerTicket() {
    timePerTicket = timePerTicket + 1;
    updateAllClients();
}

function removeSpecificTicket(customerId) {
    var poppedClientId = custIdToClientId[customerId];
    console.log("Poppedclientid  = " + poppedClientId);
    var poppedTicket = custIdToTicket[customerId];
    var poppedClient = custClients[poppedClientId];
    if (poppedClient == undefined) {
        console.log("Error popping");
        return;
    }
    poppedClient.emit('send:ticket', {
        num_in_front: 0,
        est_wait_time: 0
    });

    delete custClients[poppedClientId];
    delete clientIdToTicket[poppedClientId];
    custIdToClientId[poppedClientId] = null;
    delete clientIdToCustId[poppedClientId];
    custIdToTicket[poppedCustId] = undefined;

    updateAllClients();
}

function dequeueTicket() {
    if (queue.length <= 0) {
        console.log("Nothing in queue to dequeue!");
        return;
    }
    var poppedTicket = queue.shift();
    var poppedCustId = poppedTicket.customer_id;
    var poppedClientId = custIdToClientId[poppedCustId];
    var poppedClient = custClients[poppedClientId];

    console.log("Poppedcustid = " + poppedCustId + "\n\n");
    console.log("Dequeue ticket called, q len = " + queue.length);

    // console.log("clientIdToTicket\n" + JSON.stringify(clientIdToTicket) + "\n\n");
    // console.log("custIdToClientId\n" + JSON.stringify(custIdToClientId) + "\n\n");
    // console.log("clientIdToCustId\n" + JSON.stringify(clientIdToCustId) + "\n\n");
    // console.log("custIdToTicket\n" + JSON.stringify(custIdToTicket) + "\n\n");

    if (poppedClient == undefined) {
        console.log("Error popping");
        return;
    }

    poppedClient.emit('send:ticket', {
        ticket_num: "Your Turn! (" + poppedTicket.ticket_num + ")",
        num_in_front: 0,
        est_wait_time: 0
    });

    var customerPhone = poppedTicket.customer_phone;
    if (customerPhone != undefined && customerPhone.length == 8) {
        customerPhone = '(+65)' + customerPhone;
        var msg = "Your ticket (" + poppedTicket.ticket_num + ") has been called!";
        // if (twilioClient != undefined)
        //     twilioClient.sendSms(customerPhone, msg);
    }

    delete custClients[poppedClientId];
    delete clientIdToTicket[poppedClientId];
    custIdToClientId[poppedClientId] = null;
    delete clientIdToCustId[poppedClientId];
    custIdToTicket[poppedCustId] = undefined;


    updateAllClients();
}

module.exports = {
    connectNewClient: connectNewClient,
    createTicket: createTicket,
    dequeueTicket: dequeueTicket,
    connectNewMerchant: connectNewMerchant,
    decrementTimePerTicket: decrementTimePerTicket,
    incrementTimePerTicket: incrementTimePerTicket
}


function formatTicketNumber(originalTicketNumber) {
    if (!isNaN(originalTicketNumber)) {
        if (originalTicketNumber < 10) {
            return "000" + originalTicketNumber;
        }
        else if (originalTicketNumber < 100) {
            return "00" + originalTicketNumber;
        } else if (originalTicketNumber < 1000) {
            return "0" + originalTicketNumber;
        } else {
            return originalTicketNumber;
        }
    }
}