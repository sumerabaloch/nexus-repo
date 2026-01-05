const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const Meeting = require("../models/Meeting");

const router = express.Router();

/**
 * =========================
 * SCHEDULE MEETING
 * Investor → Entrepreneur
 * =========================
 */
router.post(
  "/schedule",
  authMiddleware,
  roleMiddleware(["investor"]),
  async (req, res) => {
    try {
      const { entrepreneurId, date, startTime, endTime } = req.body;

      if (!entrepreneurId || !date || !startTime || !endTime) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // Conflict detection
      const conflict = await Meeting.findOne({
        investor: req.user.id,
        date,
        startTime,
        endTime,
        status: { $ne: "rejected" },
      });

      if (conflict) {
        return res
          .status(400)
          .json({ message: "You already have a meeting at this time" });
      }

      const meeting = await Meeting.create({
        investor: req.user.id,
        entrepreneur: entrepreneurId,
        date,
        startTime,
        endTime,
        status: "pending",
      });

      res.status(201).json({
        message: "Meeting scheduled successfully",
        meeting,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

/**
 * =========================
 * ACCEPT MEETING
 * Entrepreneur
 * =========================
 */
router.put(
  "/accept/:id",
  authMiddleware,
  roleMiddleware(["entrepreneur"]),
  async (req, res) => {
    try {
      const meeting = await Meeting.findById(req.params.id);

      if (!meeting) {
        return res.status(404).json({ message: "Meeting not found" });
      }

      meeting.status = "accepted";
      await meeting.save();

      res.json({ message: "Meeting accepted", meeting });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

/**
 * =========================
 * REJECT MEETING
 * Entrepreneur
 * =========================
 */
router.put(
  "/reject/:id",
  authMiddleware,
  roleMiddleware(["entrepreneur"]),
  async (req, res) => {
    try {
      const meeting = await Meeting.findById(req.params.id);

      if (!meeting) {
        return res.status(404).json({ message: "Meeting not found" });
      }

      meeting.status = "rejected";
      await meeting.save();

      res.json({ message: "Meeting rejected", meeting });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

/**
 * =========================
 * GET MY MEETINGS
 * Investor & Entrepreneur
 * =========================
 */
router.get(
  "/my-meetings",
  authMiddleware,
  async (req, res) => {
    try {
      const meetings = await Meeting.find({
        $or: [
          { investor: req.user.id },
          { entrepreneur: req.user.id },
        ],
      })
        .populate("investor", "name email")
        .populate("entrepreneur", "name email")
        .sort({ date: 1, startTime: 1 });

      res.json(meetings);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;