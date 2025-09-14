import { validateFormData } from "../src/utils/validation.js";
import Transaction from "../models/transaction.js";
import User from "../models/user.js";

export const addTransaction = async (req, res) => {
  const session = await Transaction.startSession(); // start session
  session.startTransaction();

  try {
    const { form } = req.body;
    const loggedInUser = req.user; 

    console.log("Transaction data received:", form);

    // Validate user exists
    const user = await User.findById(loggedInUser._id).session(session);
    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "User not found" });
    }

    
    validateFormData(form);

    // Create new transaction
    const newTransaction = new Transaction({
      userId: user._id,
      type: form.type,
      category: form.category,
      amount: form.amount,
      notes: form.note,
      date: form.date,
    });

    const amount = Number(form.amount);  // or parseFloat(form.amount)

    if (form.type === "income") {
      user.totalIncome += amount;
    } else if (form.type === "expense") {
      user.totalExpense += amount;
    }


    // Save both within session
    await newTransaction.save({ session });
    await user.save({ session });

    await session.commitTransaction(); // commit if all succeed
    session.endSession();

    return res.status(200).json({
      message: "Transaction added successfully",
      transaction: newTransaction,
      updatedUser: {
        totalIncome: user.totalIncome,
        totalExpense: user.totalExpense,
      },
    });

  } catch (error) {
    await session.abortTransaction(); // rollback if any error
    session.endSession();
    console.log("Error in adding transaction :", error.message);
    return res.status(500).json({
      message: "Error in adding transaction. Please try again.",
    });
  }
};

export const updateTransaction = async (req, res) => {
  const session = await Transaction.startSession();
  session.startTransaction();

  try {
    const { form } = req.body; // form should contain _id of transaction and updated details
    const loggedInUser = req.user;

    console.log("Transaction update data received:", form);

    // Validate user exists
    const user = await User.findById(loggedInUser._id).session(session);
    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "User not found" });
    }

    // Validate form fields
    validateFormData(form);

    // Find existing transaction
    console.log("Finding transaction with ID:", form._id);
    const transaction = await Transaction.findById(form._id).session(session);
    if (!transaction) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Subtract old transaction contribution
    const oldAmount = Number(transaction.amount);
    if (transaction.type === "income") {
      user.totalIncome -= oldAmount;
    } else if (transaction.type === "expense") {
      user.totalExpense -= oldAmount;
    }

    // Update transaction details
    transaction.type = form.type;
    transaction.category = form.category;
    transaction.amount = Number(form.amount);
    transaction.notes = form.note;
    transaction.date = form.date;

    // Add updated transaction contribution
    const newAmount = transaction.amount;
    if (transaction.type === "income") {
      user.totalIncome += newAmount;
    } else if (transaction.type === "expense") {
      user.totalExpense += newAmount;
    }

    // Save both within session
    await transaction.save({ session });
    await user.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      message: "Transaction updated successfully",
      transaction,
      updatedUser: {
        totalIncome: user.totalIncome,
        totalExpense: user.totalExpense,
      },
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error in updating transaction:", error.message);
    return res.status(500).json({
      message: "Error in updating transaction. Please try again.",
    });
  }
};

export const deleteTransaction = async (req, res) => {
  const session = await Transaction.startSession();
  session.startTransaction();

  try {
    const { form } = req.body; 
    const loggedInUser = req.user;

    // Validate user exists
    const user = await User.findById(loggedInUser._id).session(session);
    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "User not found" });
    }

    // Find the transaction to delete
    const transaction = await Transaction.findById(form._id).session(session);
    if (!transaction) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Subtract the transaction contribution from user's totals
    const amount = Number(transaction.amount);
    if (transaction.type === "income") {
      user.totalIncome -= amount;
    } else if (transaction.type === "expense") {
      user.totalExpense -= amount;
    }

    // Delete the transaction
    await Transaction.deleteOne({ _id: transaction._id }).session(session);

    // Save user changes
    await user.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      message: "Transaction deleted successfully",
      updatedUser: {
        totalIncome: user.totalIncome,
        totalExpense: user.totalExpense,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error in deleting transaction:", error.message);
    return res.status(500).json({
      message: "Error in deleting transaction. Please try again.",
    });
  }
};

export const searchTransactions = async (req, res) => {
  try {
    const { form } = req.body;
    const loggedInUser = req.user;

    console.log("Search criteria received:", form);

    // Validate user exists
    const user = await User.findById(loggedInUser._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    // Build dynamic filter
    let filter = { userId: user._id };

    if (form.type && form.type.trim() !== "") {
      filter.type = form.type;
    }

    if (form.category && form.category.trim() !== "") {
      filter.category = form.category;
    }

    if (form.amount && form.amount !== "") {
      filter.amount = Number(form.amount); // exact match for amount
    }

    // Handle date range
    if (form.dateFrom || form.dateTo) {
      filter.date = {};
      if (form.dateFrom) {
        filter.date.$gte = new Date(form.dateFrom);
      }
      if (form.dateTo) {
        // end of that date (23:59:59)
        const toDate = new Date(form.dateTo);
        toDate.setHours(23, 59, 59, 999);
        filter.date.$lte = toDate;
      }
    }

    console.log("MongoDB filter:", filter);

    // Fetch with pagination
    const transactions = await Transaction.find(filter)
      .skip(skip)
      .limit(Number(limit))
      .sort({ date: -1 }); // latest first

    const total = await Transaction.countDocuments(filter);

    res.json({
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit),
      data: transactions,
    });
  } catch (error) {
    console.error("Error searching transactions:", error);
    res
      .status(500)
      .json({ message: "Server error while searching transactions." });
  }
};
