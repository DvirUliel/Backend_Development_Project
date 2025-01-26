const apiRoutes = require('./routes/api');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();;

// Initializes an instance of an Express application
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', apiRoutes);

// Connect for the database
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

module.exports = app;
