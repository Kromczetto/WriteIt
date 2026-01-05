const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

mongoose.connect(process.env.MONGO_URL)
  .then(() => {
      console.log("Connected to MongoDB");
  })  
  .catch((err) => { 
      console.log(err)
  });

const app = express();
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false}));

app.use('/auth', require('./routers/authRoutes'));
app.use('/api', require('./routers/workRoutes'));
app.use('/api', require('./routers/rentalRoutes'));


const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
