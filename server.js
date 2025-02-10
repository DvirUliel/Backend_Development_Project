const app = require('./app');

const PORT = process.env.PORT;

/**
 * @file Server startup configuration.
 * @description Starts the Express server and listens on the specified port.
 * @module server
 */

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
