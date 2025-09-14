const Transaction = require("../models/transaction");

exports.searchForGraphs = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ message: "Start and end dates are required" });
    }

    // Fetch transactions between range
    const transactions = await Transaction.find({
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
      userId: req.user._id, // ✅ filter only user's transactions
    });

    // Aggregate income vs expense
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((tx) => {
      if (tx.type === "income") totalIncome += tx.amount;
      else if (tx.type === "expense") totalExpense += tx.amount;
    });

    res.json({
      startDate,
      endDate,
      totalIncome,
      totalExpense,
      transactions,
    });
  } catch (error) {
    // console.error("Error fetching graph data:", error);
    res.status(500).json({
      message: "Internal Server Error while fetching graph data",
    });
  }
};
