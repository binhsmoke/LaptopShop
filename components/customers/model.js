const mongoose = require("mongoose");
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId;

const customerSchema = new Schema({
    id: {type : ObjectId},
    username: {type : String},
    password: {type : String},
    name: {type : String},
    email: {type : String},
    phone: {type : String},
    address: {type : String},
    image: {type : String},
});

module.exports = mongoose.model('customer', customerSchema);