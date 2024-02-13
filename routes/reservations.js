const express = require('express');
const Reservation = require('../models/reservation');

const router = express.Router();

// Endpoint to book a reservation
router.post('/reservations', async (req, res) => {
  const reservation = new Reservation(req.body);
  try {
    await reservation.save();
    res.status(201).send(reservation);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Endpoint to get all reservations
router.get('/reservations', async (req, res) => {
  try {
    const reservations = await Reservation.find({});
    res.send(reservations);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
