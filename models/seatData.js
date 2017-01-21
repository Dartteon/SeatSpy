"use strict"
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/*fields*/
const SeatDataSchema = new Schema({
    seats               : [Boolean],
    numEmptySeats       : Number,
    numFullSeats        : Number,
    saveTime            : Date
});

module.exports = mongoose.model("SeatData", SeatDataSchema);
