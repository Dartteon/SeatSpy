
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

module.exports = {
    saveData: saveData
}