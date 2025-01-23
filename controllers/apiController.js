const Cost = require('../models/Cost');
const User = require('../models/User');

// Add Cost Item
exports.addCost = async (req, res) => {
  try {
    const { description, category, userid, sum, date } = req.body;
    const cost = new Cost({ description, category, userid, sum, date });
    const savedCost = await cost.save();
    res.status(201).json(savedCost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Monthly Report
exports.getMonthlyReport = async (req, res) => {
  const { id, year, month } = req.query;
  try {
    const costs = await Cost.find({
      userid: id,
      date: {
        $gte: new Date(year, month - 1, 1),
        $lt: new Date(year, month, 1),
      },
    });
    res.status(200).json(costs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get User Details
exports.getUserDetails = async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.id });
    const costs = await Cost.find({ userid: req.params.id });
    const totalCost = costs.reduce((sum, cost) => sum + cost.sum, 0);

    if (user) {
      res.status(200).json({
        first_name: user.first_name,
        last_name: user.last_name,
        id: user.id,
        total: totalCost,
      });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get About
exports.getAbout = async (req, res) => {
  try {
    const teamMembers = await User.find();
    res.status(200).json(teamMembers.map(member => ({
      first_name: member.first_name,
      last_name: member.last_name,
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
