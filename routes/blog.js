const express = require('express');
const router = express.Router();

const blogController = require("../controllers/blog");
const isAuth = require('../middleware/isAuth');

// Make post
router.post("/", isAuth, blogController.newPost);

// Delete post
router.delete("/:postId", isAuth, blogController.deletePost);

// Get post
router.get("/:postId", isAuth, blogController.getPost);

// Get user's posts
router.get("/", isAuth, blogController.getPosts);

// Like post
router.post("/like/:postId", isAuth, blogController.like);

// Unlike post
router.post("/unlike/:postId", isAuth, blogController.unlike);

// Comment on post
router.post("/comment/:postId", isAuth, blogController.newComment);

module.exports = router;