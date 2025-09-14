const express = require("express");
const router = express.Router();
const {userAuth} = require("../middlewares/auth");
const { addTransaction, searchTransactions, updateTransaction, deleteTransaction } = require("../controllers/transactionController");


router.post("/transaction/add" , userAuth , addTransaction );

router.post("/transaction" , userAuth , searchTransactions );

router.post("/transaction/update" , userAuth , updateTransaction);

router.delete("/transaction/delete" , userAuth , deleteTransaction );

module.exports = router;