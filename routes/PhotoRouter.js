const express = require("express");
const Photo = require("../db/photoModel");
const User = require("../db/userModel");
const mongoose = require("mongoose");
const router = express.Router();

router.post("/", async (request, response) => {});

router.get("/", async (request, response) => {});

// GET /photosOfUser/:id - Get photos of a user
router.get("/photosOfUser/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    // Get user's photos with comments
    const photos = await Photo.find({ user_id: req.params.id });

    if (!photos) {
      return res.status(400).json({ error: "No photos found for this user" });
    }

    // Process photos and get user details for comments
    const processedPhotos = await Promise.all(
      photos.map(async (photo) => {
        // Process comments to include user details
        const processedComments = await Promise.all(
          photo.comments.map(async (comment) => {
            const commentUser = await User.findById(comment.user_id).select(
              "_id first_name last_name"
            );

            return {
              _id: comment._id,
              comment: comment.comment,
              date_time: comment.date_time,
              user: commentUser,
            };
          })
        );

        // Return processed photo object
        return {
          _id: photo._id,
          user_id: photo.user_id,
          file_name: photo.file_name,
          date_time: photo.date_time,
          comments: processedComments,
        };
      })
    );

    res.json(processedPhotos);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
