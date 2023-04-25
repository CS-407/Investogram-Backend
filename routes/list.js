const express = require('express');
const router = express.Router();

const listController = require("../controllers/list");
const isAuth = require('../middleware/isAuth');

// Get a list
router.get("/get/:listId", listController.getList);

// Get a list
router.post("/update", listController.updateList);

// Get a user's lists
router.get("/getLists/:userId", listController.getUsersLists);

module.exports = router;