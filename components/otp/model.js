const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

// Author: Mai Xuân Phi
// OTP
const otpSchema = new Schema({
    id: { type: ObjectId },
    email: { type: String, default: null }, // Email xác thực
    number: {type: Number, default: null},
    date: {type: String, default: null}, // 5/17/2022 mm/dd/yyyy
    code_otp: {type: Number, default: null} // Mã oTP
})

module.exports = mongoose.model('otps', otpSchema)