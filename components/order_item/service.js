const orderItemModel = require('./model')

exports.getAll = async (id) => {
    return await orderItemModel.find({
        order_id: id
        // }).populate(['order_id', 'productSize_id']);
    }).populate(['order_id']);
}

exports.insert = async (item) => {
    const p = new orderItemModel(item);
    return await p.save();
}