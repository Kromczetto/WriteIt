const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL)
  .then(() => {
      console.log("Connected to MongoDB");
  })  
  .catch((err) => { 
      console.log(err)
  });

const app = express();
app.use(express.json());

app.use('/', require('./routers/authRoutes'));

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
