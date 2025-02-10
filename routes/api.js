const express = require('express');
const { addCost, getMonthlyReport, getUserDetails, getAbout } = require('../controllers/apiController');
const router = express.Router();

/**
 * Express router for handling cost management API routes.
 * @module routes/api
 */
router.post('/add', addCost);
router.get('/report', getMonthlyReport);
router.get('/users/:id', getUserDetails);
router.get('/about', getAbout);

module.exports = router;
