"use strict";
const router = require('express').Router();
const seatManager = require('../managers/seatManager.js');

router.get('/seat-data-highchart', (request, response, next) => {
    seatManager.getSeatDataHighChart (request, response, next);
});

module.exports = router;