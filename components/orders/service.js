const orderModel = require('./model')
const { enumStatusOrder } = require('../../utils/constants');

exports.getAll = async () => {
    const o = await orderModel.find().populate(['user_id']).sort({ updatedAt: -1 });
    return o;
}


exports.insert = async (order) => {
    const o = new orderModel(order);
    return await o.save();
}


exports.getById = async (id) => {
    const one = await orderModel.findById(id).populate(['user_id']);
    return one;
}

exports.change = async (id, status) => {
    const o = await orderModel.findByIdAndUpdate(id, {status: status});
    return o;
}
exports.getInDay = async (begin, end) => {
    const o = await orderModel.find({updatedAt: {$gte: begin, $lt: end}, status: enumStatusOrder.taken }).sort({updatedAt: 1});
    return o;
}