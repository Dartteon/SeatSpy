module.exports = function (socket) {
    socket.emit('init', {
        queueData: 
            null,

        ticketData: 
            null
    });

    socket.on('retrieve:info', {
        queueData: {
            num_customers_in_front: "5",
            est_wait_time: "50"
        },

        ticketData:
            null
    });
    
    socket.on('get:ticket', function (data) {
        console.log("Retrieved data from FE : " + JSON.stringify(data));
        socket.broadcast.emit('send:ticketData', {
            customer_id: a123,
            ticket_num: b0001,
            num_customers_in_front: 2,
            est_wait_time: 20
        });
    });

}