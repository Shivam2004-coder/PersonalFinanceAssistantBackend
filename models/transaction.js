const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    type: {
        type: String,
        enum: ['income', 'expense'],
        required: true, 
    },
    amount: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    notes: {
        type: String,
        default: "",
    },
    date: {
        type: Date,
        required: true,
        default: Date.now,
    }
}, { timestamps: true });

const Transaction = mongoose.model("Transaction" , transactionSchema);

module.exports = Transaction;