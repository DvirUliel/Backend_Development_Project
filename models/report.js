const mongoose = require('mongoose');

/**
 * Schema representing an individual cost item.
 * 
 * @typedef {Object} CostItem
 * @property {string} description - Description of the cost item.
 * @property {number} sum - The amount spent on the item.
 * @property {number} day - The day of the month the expense was made.
 */
const itemsSchema = new mongoose.Schema({
  description: { type: String, required: true },
  sum: { type: Number, required: true },
  day: { type: Number, required: true },
});

/**
 * Schema representing a monthly financial report for a user.
 * 
 * @typedef {Object} reportModel
 * @property {string} userid - Unique identifier for the user.
 * @property {number} year - The year the report is for.
 * @property {number} month - The month the report is for.
 * @property {Object[]} costs - Categorized costs for the report.
 * @property {CostItem[]} costs.food - List of food-related expenses.
 * @property {CostItem[]} costs.education - List of education-related expenses.
 * @property {CostItem[]} costs.health - List of health-related expenses.
 * @property {CostItem[]} costs.housing - List of housing-related expenses.
 * @property {CostItem[]} costs.sport - List of sport-related expenses.
 * @property {Date} createdAt - Timestamp when the report was created.
 */
const reportSchema = new mongoose.Schema({
  userid: { type: String, required: true },
  year: { type: Number, required: true },
  month: { type: Number, required: true },
  costs: [
    {
      food: [itemsSchema],
      education: [itemsSchema],
      health: [itemsSchema],
      housing: [itemsSchema],
      sport: [itemsSchema],
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

/**
 * Mongoose model for the Report schema.
 * @type {mongoose.Model<reportModel>}
 */
module.exports = mongoose.model('reportModel', reportSchema);