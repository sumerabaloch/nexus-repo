const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// Common profile route
router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Profile accessed",
    user: req.user,
  });
});

// Entrepreneur only
router.get(
  "/entrepreneur",
  authMiddleware,
  roleMiddleware(["entrepreneur"]),
  (req, res) => {
    res.json({
      message: "Entrepreneur dashboard access granted",
    });
  }
);

// Investor only
router.get(
  "/investor",
  authMiddleware,
  roleMiddleware(["investor"]),
  (req, res) => {
    res.json({
      message: "Investor dashboard access granted",
    });
  }
);

module.exports = router;