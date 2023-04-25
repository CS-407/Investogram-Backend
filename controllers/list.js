const StockList = require('../models/stockList');

exports.getList = async (req, res) => {
    try {
        const { listId } = req.params;
        const obj = await StockList.findById(listId).populate('stocks').populate('list_owner');
        console.log(obj);
        res.status(200).json(obj);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
}