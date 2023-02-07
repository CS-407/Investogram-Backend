const express = require('express');
const router = express.Router();

const blogController = require("../controllers/blog");

// Make post
router.post("/", blogController.newPost);

// Delete post
router.delete("/:postId", blogController.deletePost);

// Get post
router.get("/:postId", blogController.getPost);

// Get user's posts
router.get("/", blogController.getPosts);

// Like post
router.post("/like/:postId", blogController.like);

// Unlike post
router.post("/unlike/:postId", blogController.unlike);

// Comment on post
router.post("/comment/:postId", blogController.newComment);

module.exports = router;