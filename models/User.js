const mongoose = require('mongoose');

/**
 * Mongoose schema for the User model.
 * Represents a user with personal details including name, birthday, and marital status.
 * 
 * @typedef {Object} userModel
 * @property {string} id - Unique identifier for the user.
 * @property {string} first_name - User's first name.
 * @property {string} last_name - User's last name.
 * @property {Date} [birthday] - User's birthday (optional).
 * @property {string} [marital_status] - User's marital status (optional).
 */
const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  birthday: { type: Date },
  marital_status: { type: String },
});

/**
 * Mongoose model for the User schema.
 * @type {mongoose.Model<userModel>}
 */
module.exports = mongoose.model('userModel', userSchema);
