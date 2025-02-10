const Cost = require('../models/Cost');
const User = require('../models/User');
const Report = require('../models/Report');
const { groupCostsByCategory } = require('../utils/groupCosts');

/**
 * Adds a new cost item to the database and updates the report if it exists.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void} Returns a JSON response with the added cost or an error message.
 */
exports.addCost = async (req, res) => {
  console.log("Received POST request data:", req.body);

  try {
    const { description, category, userid, sum } = req.body;

    // If no date is provided, use the current date.
    const date = req.body.date ? new Date(req.body.date) : new Date();

    // Check if all required fields are present.
    if (!description || !category || !userid || !sum) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Save the new cost.
    const cost = new Cost({ description, category, userid, sum, date });
    const savedCost = await cost.save();

    // Extract year and month from the date.
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    // Check if there's an existing report for the user, year, and month.
    const existingReport = await Report.findOne({ userid, year, month });

    if (existingReport) {
      let categoryData = existingReport.costs[0][category];

      // Initialize the category if it doesn't exist.
      if (!categoryData) {
        categoryData = [];
      }

      // Update the report with the new cost.
      console.log("Updating the new cost in the existing report");
      categoryData.push({ description, sum, day: date.getDate() });
      existingReport.costs[0][category] = categoryData;

      await existingReport.save();
      res.status(201).json(savedCost);
    } else {
      // If the report doesn't exist, just return the saved cost.
      console.log("No existing report found, but cost added successfully to the database");
      res.status(201).json(savedCost);
    }
  } catch (error) {
    console.error("Error adding cost item:", error.message);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Retrieves the user's monthly report based on the provided year and month.
 * @param {Object} req - The request object containing the query parameters.
 * @param {Object} res - The response object.
 * @returns {void} Returns the report or an error message.
 */
exports.getMonthlyReport = async (req, res) => {
  try {
    const { id, year, month } = req.query;

    const parsedYear = parseInt(year, 10);
    const parsedMonth = parseInt(month, 10);

    if (isNaN(parsedYear) || isNaN(parsedMonth)) {
      return res.status(400).json({ error: "Invalid year or month" });
    }

    if (!id || !year || !month) {
      return res.status(400).json({ error: "Missing required query parameters" });
    }

    let report = await Report.findOne({ userid: id, year: parsedYear, month: parsedMonth });
    
    if (report) {
      console.log("There is an existing report, loaded from the database");
    } else {
      // If the report doesn't exist, look for all costs for the given month and year.
      const costs = await Cost.find({
        userid: id,
        date: {
          $gte: new Date(parsedYear, parsedMonth - 1, 1),
          $lt: new Date(parsedYear, parsedMonth, 1),
        },
      });

      // Group the costs by category using the helper function.
      const groupedCosts = groupCostsByCategory(costs);

      // Update the report with grouped costs.
      console.log("Creating a new report");
      report = new Report({
        userid: id,
        year: parsedYear,
        month: parsedMonth,
        costs: [
          {
            food: groupedCosts.food || [],
            education: groupedCosts.education || [],
            health: groupedCosts.health || [],
            housing: groupedCosts.housing || [],
            sport: groupedCosts.sport || [],
          },
        ],
      });
      await report.save();
    
    }

    res.status(200).json(report);
  } catch (error) {
    console.error("Error fetching report:", error.message);
    res.status(500).json({ error: error.message });
  }
};


/**
 * Retrieves the user's details and their total cost.
 * @param {Object} req - The request object containing the user ID in the parameters.
 * @param {Object} res - The response object.
 * @returns {void} Returns the user's details and total cost or an error message.
 */
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

/**
 * Retrieves the list of all team members.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void} Returns the list of team members or an error message.
 */
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
