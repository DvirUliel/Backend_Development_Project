const mongoose = require('mongoose');

const itemsSchema = new mongoose.Schema({
  description: { type: String, required: true },
  sum: { type: Number, required: true },
  date: { type: Date, required: true }
});

const reportSchema = new mongoose.Schema({
  userid: { type: String, required: true },
  year: { type: Number, required: true },
  month: { type: Number, required: true },
  data: { 
    type: Map,
    of: {
      totalAmount: { type: Number, required: true },
      items: { type: [itemsSchema], required: true }
    },
    required: true 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', reportSchema);
