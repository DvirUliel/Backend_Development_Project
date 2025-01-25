const Cost = require('../models/Cost');
const User = require('../models/User');

// Add Cost Item
exports.addCost = async (req, res) => {
  console.log("Received POST request data:", req.body);

  try {
    const { description, category, userid, sum } = req.body;
    const date = req.body.date || new Date(); // Use the provided date or default to current date/time

    if (!description || !category || !userid || !sum) {
      return res.status(400).json({ error: "Missing required fields: description, category, userid, or sum" });
    }

    const cost = new Cost({ description, category, userid, sum, date });

    const savedCost = await cost.save();

    res.status(201).json(savedCost);
  } catch (error) {
    console.error("Error adding cost item:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Get Monthly Report
exports.getMonthlyReport = async (req, res) => {
  const { id, year, month } = req.query;

  try {
    // Fetch the costs for the given user, year, and month
    const costs = await Cost.find({
      userid: id,
      date: {
        $gte: new Date(year, month - 1, 1),
        $lt: new Date(year, month, 1),
      },
    });

    // Group costs by category
    const groupedCosts = costs.reduce((result, cost) => {
      const key = cost.category;

      if (!result[key]) {
        result[key] = {
          category: cost.category,
          userid: cost.userid,
          totalAmount: 0,
          items: [],
        };
      }

      result[key].totalAmount += cost.sum;
      result[key].items.push({
        description: cost.description,
        sum: cost.sum,
        date: cost.date,
      });

      return result;
    }, {});

    // Convert the grouped costs object to an array
    const response = Object.values(groupedCosts);

    res.status(200).json(response);
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
