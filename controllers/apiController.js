const Cost = require('../models/Cost');
const User = require('../models/User');

// Using a computed design pattern with class that's computed properties with caching
class ComputedCostHandler {
  constructor() {
    this.costsCache = null; 
    this.totalCostCache = null; 
  }

  // Load costs and reset caches
  async loadCosts(userId, filter = {}) {
    // Loading an array of data in memory
    this.costsCache = await Cost.find({ userid: userId, ...filter }); 

    // Invalidate cache for total cost
    this.totalCostCache = null; 
  }

  // Computed property for total cost
  get totalCost() {
    if (this.totalCostCache === null) {
      // run over the costCache and sum all
      this.totalCostCache = this.costsCache.reduce((sum, cost) => sum + cost.sum, 0);
    }
    return this.totalCostCache;
  }

  // Computed property for grouped costs
  get groupedCosts() {
    return this.costsCache.reduce((result, cost) => {
      const key = cost.category;

      //Using a bucket design pattern
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
  }
}

// Add Cost Item
exports.addCost = async (req, res) => {
  console.log("Received POST request data:", req.body);

  try {
    const { description, category, userid, sum } = req.body;
    // if date not inserted in the query, use the current time date
    const date = req.body.date || new Date();

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
  const handler = new ComputedCostHandler();

  try {
    await handler.loadCosts(id, {
      date: {
        // filter by the start and the end of specific month 
        $gte: new Date(year, month - 1, 1),
        $lt: new Date(year, month, 1),
      },
    });

    const groupedCosts = handler.groupedCosts;
    const response = Object.values(groupedCosts);

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get User Details
exports.getUserDetails = async (req, res) => {
  const handler = new ComputedCostHandler();

  try {
    const user = await User.findOne({ id: req.params.id });
    await handler.loadCosts(req.params.id);

    if (user) {
      res.status(200).json({
        first_name: user.first_name,
        last_name: user.last_name,
        id: user.id,
        total: handler.totalCost,
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
