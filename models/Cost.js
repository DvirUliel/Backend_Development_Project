const mongoose = require('mongoose');

/**
 * Schema representing an individual cost entry.
 * 
 * @typedef {Object} Cost
 * @property {string} description - Description of the cost item.
 * @property {string} category - Category of the expense (e.g., food, health, housing).
 * @property {string} userid - Unique identifier for the user who made the expense.
 * @property {number} sum - The amount spent on the item.
 * @property {Date} date - The date the expense was recorded (defaults to the current date).
 */
const costSchema = new mongoose.Schema({
  description: { type: String, required: true },
  category: { type: String, required: true },
  userid: { type: String, required: true },
  sum: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

/**
 * Mongoose model for the Cost schema.
 * @type {mongoose.Model<Cost>}
 */
module.exports = mongoose.model('Cost', costSchema);
