const apiRoutes = require('./routes/api');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

/**
 * @file Main application entry point.
 * @description Initializes the Express application, sets up middleware, connects to MongoDB, and defines API routes.
 * @module app
 */

// Initializes an instance of an Express application
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Middleware to parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// Mount API routes under the `/api` endpoint
app.use('/api', apiRoutes);

/**
 * Connects to the MongoDB database using the connection string from environment variables.
 * Logs success or error messages based on the connection status.
 */
async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    // Handling the connection error by sending a 500 response
    process.exit(1);  // Terminate the process if DB connection fails
  }
}

connectToDatabase();

module.exports = app;
