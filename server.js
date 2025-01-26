const app = require('./app');

const PORT = process.env.PORT;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
