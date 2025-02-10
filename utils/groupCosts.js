/**
 * Groups costs by their category.
 * @param {Array} costs - The list of cost objects to be grouped.
 * @returns {Object} An object where each key is a category and the value is an array of cost objects for that category.
 */
function groupCostsByCategory(costs) {
    return costs.reduce((result, cost) => {
      const key = cost.category;
      if (!result[key]) {
        result[key] = [];
      }
      result[key].push({
        description: cost.description,
        sum: cost.sum,
        day: cost.date.getDate(), // Adding the day from the date
      });
      return result;
    }, {});
  }
  
  module.exports = { groupCostsByCategory };
  