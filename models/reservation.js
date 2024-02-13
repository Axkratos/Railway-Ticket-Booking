const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  from: String,
  to: String,
  trainNumber: Number,
  class: String,
  passengers: Number,
  passengerDetails: [{
    name: String,
    age: Number,
    gender: String,
  }],
  address: String,
  paymentMode: String,
  mobileNumber: String,
});

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;
