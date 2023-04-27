const express = require('express');
const router = express.Router();

const listController = require("../controllers/list");
const isAuth = require('../middleware/isAuth');

// Get user's lists
router.get("/", isAuth, listController.getLists);

// Create a new list
router.post("/create", isAuth, listController.createNewList);

// Get a list
router.get("/get/:listId", isAuth, listController.getList);

// Update a list
router.post("/update", listController.updateList);

module.exports = router;