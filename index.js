const express = require("express");
const path = require("path");
const cors = require("cors");
const Reservation = require("./models/reservation.js");
require("./db.js/index.js");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Serve the index.html for normal users
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

// Serve the admin.html for admin users
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/admin.html"));
});

// Controller for handling form submission
app.post("/api/reservations", async (req, res) => {
  try {
    // Extracting data from the request body
    const {
      from,
      to,
      trainNumber,
      class: travelClass,
      passengers,
      passengerDetails,
      address,
      paymentMode,
      mobileNumber,
    } = req.body;

    // Creating a new reservation object
    const newReservation = new Reservation({
      from,
      to,
      trainNumber,
      class: travelClass,
      passengers,
      passengerDetails,
      address,
      paymentMode,
      mobileNumber,
    });

    // Saving the reservation to the database
    await newReservation.save();

    // Sending a success response
    res.status(201).json({ message: "Reservation created successfully" });
  } catch (error) {
    // Handling errors
    console.error("Error during reservation creation:", error);
    res.status(500).json({ error: `Internal Server Error: ${error.message}` });
  }
});

// Get all reservations
app.get("/api/reservations", async (req, res) => {
  try {
    const reservations = await Reservation.find();
    res.json(reservations);
  } catch (error) {
    console.error("Error fetching reservations:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete a reservation by ID
app.delete("/api/reservations/:id", async (req, res) => {
  try {
    const deletedReservation = await Reservation.findByIdAndDelete(req.params.id);
    if (!deletedReservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }
    res.json({ message: "Reservation deleted successfully" });
  } catch (error) {
    console.error("Error deleting reservation:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Error handling middleware

app.listen(port, () => {
  console.log(`Server is running at port no ${port}`);
});
