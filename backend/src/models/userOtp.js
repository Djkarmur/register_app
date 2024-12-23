const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userOtpSchema = new Schema({
    userId: String,
    otp:String,
    createdAt:Date,
    expiredAt:Date
});

const userOtp = mongoose.model('userOtp',userOtpSchema);

module.exports = userOtp;