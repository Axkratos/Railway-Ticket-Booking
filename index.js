const express = require('express');
const path = require('path');
const cors = require('cors');
const Reservation = require('./models/reservation.js');
require('./db.js/index.js');
const multer = require('multer');
const app = express();
const port = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'));
        }
    },
}).single('photo');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/cart', (req, res) => {
  res.sendFile(path.join(__dirname, './public/cart.html'));
});

app.post('/api/reservations', upload, async (req, res) => {
  try {
    const { from, to, trainNumber, class: travelClass, passengers, passengerDetails, address, paymentMode, mobileNumber } = req.body;
    console.log(req.body)
    const newReservation = new Reservation({
      from,
      to,
      trainNumber,
      class: travelClass,
      passengers,
      passengerDetails,
      address,
      paymentMode,
      photo: req.file ? req.file.buffer.toString('base64') : null,
      mobileNumber,
    });
    await newReservation.save();
    res.redirect('/cart');
  } catch (error) {
    console.error('Error during reservation creation:', error);
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

// Get reservation by ID
app.get("/api/reservations/:id", async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }
    res.json(reservation);
  } catch (error) {
    console.error("Error fetching reservation:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

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

const adminCredentials = {
  email: 'admin@gmail.com',
  password: 'admin'
};

// Route for handling admin login
app.post('/adminlogin', cors(),(req, res) => {
  const { email, password } = req.body;
  console.log(req.body)

  if (email === adminCredentials.email && password === adminCredentials.password) {
      res.json({ success: true, message: 'Admin login successful' });
  } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
  }
});

app.listen(port, () => {
  console.log(`Server is running at port no ${port}`);
});
