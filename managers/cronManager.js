const CronJob = require('cron').CronJob;
const seatManager = require('./seatManager.js');
var moment = require('moment');

var tenMinCronString = '*/1 * * * *';

function startAllCronjobs() {
  console.log("Cron job started!");
  hourlyCronJob = new CronJob(tenMinCronString, function () {
    seatManager.saveSeatData();
  }, null, true, 'Asia/Singapore');
}

module.exports = {
  startAllCronjobs: startAllCronjobs
}