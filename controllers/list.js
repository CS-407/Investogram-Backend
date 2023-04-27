const StockList = require('../models/stockList');

exports.getList = async (req, res) => {
    try {
        const { listId } = req.params;
        const obj = await StockList.findById(listId).populate('stocks').populate('list_owner');
        res.status(200).json(obj);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
}

exports.updateList = async (req, res) => {
    try {
        const list = req.body;

        // Flatten the list
        const stocks = list.stocks.map(stock => stock._id);
        list.stocks = stocks;
        const ownerId = list.list_owner._id;
        list.list_owner = ownerId;

        // Update the list object
        const listId = list._id;
        let obj = await StockList.findById(listId);
        obj = Object.assign(obj, list);
        await obj.save();
        res.status(200).json(obj);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
}

exports.getUsersLists = async (req, res) => {
    try {
        const { userId } = req.params;
        const obj = await StockList.find({ list_owner: userId });
        res.status(200).json(obj);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
}