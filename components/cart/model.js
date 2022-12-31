const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const cartSchema = new Schema( {
    id : {type : ObjectId},
    categoryId: { type: Schema.Types.ObjectId, ref: 'category' },
    brandId: { type: Schema.Types.ObjectId, ref: 'brand' },
    name: { type: String },
    price: { type: String },
    image: { type: String },
    image1: { type: String },
    image2: { type: String },
    image3: { type: String },
    image4: { type: String },
    quantity: { type: String },
   
}); 
module.exports = mongoose.model('cart', cartSchema);