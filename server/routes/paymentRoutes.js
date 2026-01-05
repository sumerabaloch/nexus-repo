const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");
const authMiddleware = require("../middleware/authMiddleware");

// =====================
// DEPOSIT
// =====================
router.post("/deposit", authMiddleware, async (req, res) => {
  try {
    const { amount } = req.body;

    const transaction = await Transaction.create({
      user: req.user.id,
      type: "DEPOSIT",
      amount,
      status: "COMPLETED",
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: "Deposit failed" });
  }
});

// =====================
// WITHDRAW
// =====================
router.post("/withdraw", authMiddleware, async (req, res) => {
  try {
    const { amount } = req.body;

    const transaction = await Transaction.create({
      user: req.user.id,
      type: "WITHDRAW",
      amount,
      status: "COMPLETED",
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: "Withdraw failed" });
  }
});

// =====================
// TRANSFER
// =====================
router.post("/transfer", authMiddleware, async (req, res) => {
  try {
    const { amount, reference } = req.body;

    const transaction = await Transaction.create({
      user: req.user.id,
      type: "TRANSFER",
      amount,
      reference,
      status: "COMPLETED",
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: "Transfer failed" });
  }
});

// =====================
// TRANSACTION HISTORY
// =====================
router.get("/history", authMiddleware, async (req, res) => {
  try {
    const transactions = await Transaction.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch history" });
  }
});

module.exports = router;