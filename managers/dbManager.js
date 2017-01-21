
const secret = require('../config.json')[process.env.NODE_ENV || 'development'];
const SeatData = require ('../models/seatData.js');

function saveData (data) {
    var seatData = new SeatData();
    seatData.seats = data.seats;
    seatData.numEmptySeats = data.numEmptySeats;
    seatData.numFullSeats = data.numFullSeats;
    seatData.saveTime = new Date();
    console.log(JSON.stringify(seatData));
    seatData.save((err, newEntry) => {
        if (err) { sendMessageToUser(errorMessage) }
        else { console.log("Save successful!") }
    });
}

function getData (startDateTime, endDateTime, next) {
        SeatData.find({
            saveTime: {
                $gte: startDateTime,
                $lt: endDateTime
            }
        },

        function (err, result) {
            if (err) {
                console.log ("Error: " + err);
                return;
            }
            next(result);
        }
    
    );
}

module.exports = {
    saveData: saveData,
    getData: getData
}