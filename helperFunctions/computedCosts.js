exports.computeGroupedCosts = (costs) => {
    return costs.reduce((result, cost) => {
      const key = cost.category;
  
      if (!result[key]) {
        result[key] = {
          category: cost.category,
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
  };
  