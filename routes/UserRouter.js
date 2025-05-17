const express = require("express");
const router = express.Router();
const User = require("../db/userModel");
const mongoose = require("mongoose");

// GET /user/list - Get all users with limited fields
router.get("/list", async (req, res) => {
  try {
    const users = await User.find({}).select("_id first_name last_name");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /user/:id - Get user details by ID
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    const user = await User.findById(req.params.id).select(
      "_id first_name last_name location description occupation"
    );

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
