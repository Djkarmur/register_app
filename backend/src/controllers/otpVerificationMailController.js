const User = require('../models/userModel');
const userOtp = require('../models/userOtp');
const bcrypt = require('bcryptjs');

const otpVerification = async (req,res) => {
    try {
        const {userId,otp} = req.body
        const otpRecords = await userOtp.findOne({userId});
        console.log(otpRecords)

        if(!otpRecords){
            throw new Error("Account doesn't exist or already verified!")
        }else{
            // const {expiredAt} = otpRecords[0]
            if(otpRecords?.expiredAt < Date.now()){
                await userOtp.deleteMany({userId})
                throw new Error("OTP Expired!")
            }else{
                const hashedOtp = otpRecords?.otp
                const isSameOtp = await bcrypt.compare(otp,hashedOtp)
                if(!isSameOtp){
                    throw new Error("Invalid OTP passed ,check carefully!")
                }else{
                    await User.updateOne({_id:userId},{verified:true})
                    await userOtp.deleteMany({userId})

                    res.json({status:'Verified',message:'Email Verified Successfully!'})
                }
            }
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {otpVerification}

