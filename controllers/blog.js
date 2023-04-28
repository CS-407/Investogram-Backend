const Post = require('../models/post');
const User = require("../models/user");
const Comment = require("../models/comment");
const { body } = require('express-validator');

exports.newPost = async (req, res) => {
    try {
        const { content } = req.body;

        const newPost = new Post({
            user_id: req.user.id,
            content,
            type: 'Experience'
        });

        const post = await newPost.save();

        res.status(200).json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
}

exports.getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId).populate('user_id', 'username').populate({
            path: 'comments',
            populate: {
                path: 'user_id',
                model: 'User',
                select: 'username'
            }
        });
        
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        res.status(200).json({ msg: 'Success', post: post });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
}

exports.getUserPosts = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        if (user.followers_list.indexOf(req.user.id) == -1) {
            return res.status(401).json({ msg: 'Must follow user to see posts' });
        }

        const posts = await Post.find({ user_id: req.params.userId }).sort({ timestamp: -1 });

        if (!posts || posts.length == 0) {
            return res.status(404).json({ msg: 'No posts found' });
        }

        res.status(200).json({ msg: 'Success', posts: posts });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
}

exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find({ user_id: req.user.id }).sort({ timestamp: -1 });

        if (!posts || posts.length == 0) {
            return res.status(404).json({ msg: 'No posts found' });
        }

        res.status(200).json({ msg: 'Success', posts: posts });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
}

exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);

        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        if (post.user_id.toString() != req.user.id.toString()) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await post.remove();

        res.status(200).json({ msg: 'Post deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
}

exports.like = async (req, res) => {
    console.log("Post liked");
    try {
        const postId = req.params.postId;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }
        console.log(req.user.id);
        if (post.userlikes.indexOf(req.user.id.toString()) != -1) {
            post.likes = post.likes - 1;
            post.userlikes.remove(req.user.id.toString());
        }
        else {
            post.userlikes.push(req.user.id.toString());
            //console.log("Like or unlike" + req.body.content);
            post.likes = post.likes + 1;
        }

        await post.save();
        console.log(post.likes);
        res.status(200).json({ msg: 'Post Liked', like: post.likes });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
}

exports.unlike = async (req, res) => {
    try {
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
}

exports.newComment = async (req, res) => {
    try {
        const postId = req.params.postId;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        const newComment = new Comment({
            user_id: req.user.id,
            post_id: postId,
            content: req.body.content
        });

        const new_comment = await newComment.save();

        const populated_comment = await Comment.findById(new_comment._id).populate('user_id', 'username');

        post.comments.push(newComment.id);

        await post.save();

        res.status(200).json({ msg: 'Comment added', comment: populated_comment });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
}