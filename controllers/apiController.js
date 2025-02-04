const Cost = require('../models/Cost');
const User = require('../models/User');
const Report = require('../models/Report');
const { computeGroupedCosts } = require('../helperFunctions/computedCosts');

// Add Cost Item
exports.addCost = async (req, res) => {
  console.log("Received POST request data:", req.body);

  try {
    const { description, category, userid, sum } = req.body;

    // if there is no date in the req.body, use the current date
    const date = req.body.date ? new Date(req.body.date) : new Date();

    if (!description || !category || !userid || !sum) {
      return res.status(400).json({ error: "Missing required fields: description, category, userid, or sum" });
    }

    // Save the new cost
    const cost = new Cost({ description, category, userid, sum, date });
    const savedCost = await cost.save();

    // Extract year and month
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    // Check if a report exists for this user, year, and month
    const existingReport = await Report.findOne({ userid, year, month });

    if (existingReport) {
      let categoryData = existingReport.data.get(category);

      // If categoryData is not found, initialize it
      if (!categoryData) {
        categoryData = { totalAmount: 0, items: [] };
        existingReport.data.set(category, categoryData);
      }

      // Update report data
      console.log("Updating the new cost in the existing report");
      categoryData.totalAmount += sum;
      categoryData.items.push({ description, sum, date });

      await existingReport.save();
    }

    res.status(201).json(savedCost);
  } catch (error) {
    console.error("Error adding cost item:", error.message);
    res.status(500).json({ error: error.message });
  }
};


// Get User Report
exports.getMonthlyReport = async (req, res) => {
  try {
    const { id, year, month } = req.query;

    // Ensure year and month are numbers
    const parsedYear = parseInt(year, 10);
    const parsedMonth = parseInt(month, 10);

    if (isNaN(parsedYear) || isNaN(parsedMonth)) {
      return res.status(400).json({ error: "Invalid year or month" });
    }

    // Validate if the query parameters are provided
    if (!id || !year || !month) {
      return res.status(400).json({ error: "Missing required query parameters: id, year, or month" });
    }

    // Try to find the report for the given user, year, and month
    let report = await Report.findOne({ userid: id, year: parsedYear, month: parsedMonth });
    
    if(report) {
      console.log("There is an existing report!")
    }

    if (!report) {
      // If no report exists, fetch all costs for the specified month and year
      const costs = await Cost.find({
        userid: id,
        date: {
          $gte: new Date(parsedYear, parsedMonth - 1, 1), // Start of the month (Date constructor takes month as 0-11)
          $lt: new Date(parsedYear, parsedMonth, 1), // Start of the next month
        },
      });

      if (costs.length === 0) {
        return res.status(404).json({ error: "No costs found for this period" });
      }

      // Group the costs by category and calculate totals
      const groupedCosts = computeGroupedCosts(costs);

      // Create a new report document
      report = new Report({ userid: id, year: parsedYear, month: parsedMonth, data: groupedCosts });
      await report.save(); // Save the report to the database
    }

    // Send the report back as the response
    res.status(200).json(report);
  } catch (error) {
    console.error("Error fetching report:", error.message);
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
