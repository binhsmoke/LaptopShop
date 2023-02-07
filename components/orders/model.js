const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const { enumStatusOrder } = require('../../utils/constants');

const orderSchema = new Schema({
    id: {
        type: ObjectId
    },
    payment_id: {
        type: Number
    },
    status: {
        type: Object,
        default: enumStatusOrder.pending
    },
    total: {
        type: Number
    },
    user_id: {
        type: ObjectId,
        ref: 'customer',
    },
    createdAt: {type: Date, default: Date.now}
});

orderSchema.set('timestamps', true);
module.exports = mongoose.model('order', orderSchema);