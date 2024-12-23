// const User = require('../models/userModel');
// const userOtp = require('../models/userOtp');
// const bcrypt = require('bcrypt');
// const nodemailer = require("nodemailer");

// const createUser = async(req,res) => {
//     try {
//         const {name,email,industry,mobile} = req.body;

//         const userExists = await User.findOne({ email });
//         if (userExists) {
//           return res.status(400).json({ message: 'User already exists' });
//         }
       
//         const user = await User.create({ name, email,industry,mobile });
//         const userid = user._id
//         await otpVerificationMail({userid,email,name},res)
//         res.status(201).json({ id: user._id, name: user.name, email: user.email,industry:user.industry,mobile:user.mobile });
//     } catch (error) {
//         res.status(500).json({message:error.message});
//     }
// }

// const otpVerificationMail = async ({_id,email,userName},res) => {
    
// const transporter = nodemailer.createTransport({
//     service: "gmail",
//     host: "smtp.gmail.com",
//     port: 587,
//     secure: false, // true for port 465, false for other ports
//     auth: {
//       user: process.env.USER,
//       pass: process.env.GOOGLE_APP_PASSWORD,
//     },
//   });

 

//     try {
//         const otp = Math.floor(100000 + (Math.random() * 900000));

//         const mailOptions = {
//             from: {
//               name: "Support Team",
//               address: process.env.USER,
//             }, // sender address
//             to: email, // recipient email
//             subject: "🔐 Your Verification Code", // Subject line
//             text: `
//               Hi ${userName},
          
//               Thank you for signing up! To complete your verification, please use the One-Time Password (OTP) below:
          
//               🔑 Your OTP: ${otp}
          
//               Please enter this code on the verification page. The OTP is valid for the next 10 minutes, so make sure to complete your verification promptly.
          
//               If you did not request this, please ignore this email. For any assistance, feel free to contact our support team.
          
//               Best regards,
//               Support Team
//             `,
//             html: `
//               <p>Hi <b>${userName}</b>,</p>
              
//               <p>Thank you for signing up! To complete your verification, please use the One-Time Password (OTP) below:</p>
              
//               <h3>🔑 Your OTP: <b>${otp}</b></h3>
              
//               <p>Please enter this code on the verification page. The OTP is valid for the next <b>10 minutes</b>, so make sure to complete your verification promptly.</p>
              
//               <p>If you did not request this, please ignore this email. For any assistance, feel free to contact our support team.</p>
              
//               <p>Best regards,<br/>
//               <b>Support Team</b></p>
//             `,
//           };
//           const saltRounds = 10;
//           const hashedOtp = await bcrypt.hash(otp.toString(), saltRounds); 
//           const newUserOtp =  new userOtp({
//             userId:_id,
//             otp:hashedOtp,
//             createdAt: Date.now(),
//             expiredAt: Date.now() + 36000
//           })
//           await newUserOtp.save();
//           await transporter.sendMail(mailOptions);
//           res.json({
//             status:'pending',
//             message:'Verification OTP Email sent!',
//             data:{
//                 userId:_id,
//                 email:email
//             }
//           })

//     } catch (error) {
//         res.status(500).json({message:error.message});
//     }
// }

// module.exports = {createUser}

const User = require('../models/userModel');
const userOtp = require('../models/userOtp');
const bcrypt = require('bcryptjs');
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');

const createUser = async (req, res) => {
  try {
    const { name, email, industry, mobile } = req.body;

    
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    
    const user = await User.create({ name, email, industry, mobile,verified:false });
    const userid = user._id;

   
    const otpSent = await otpVerificationMail( userid, email, name );

    if (!otpSent) {
     
      await User.findByIdAndDelete(userid);
      return res.status(500).json({ message: 'Failed to send OTP email. Please try again.' });
    }

    const token = jwt.sign(
      { id: userid, email: user.email },
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      industry: user.industry,
      mobile: user.mobile,
      token:token,
      message: 'User created and OTP sent successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const otpVerificationMail = async ( userid, email, userName ) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false, 
    auth: {
      user: process.env.USER,
      pass: process.env.GOOGLE_APP_PASSWORD,
    },
  });

  try {
    
    const otp = Math.floor(100000 + Math.random() * 900000);

    
    const mailOptions = {
      from: {
        name: "Support Team",
        address: process.env.USER,
      },
      to: email,
      subject: "🔐 Your Verification Code",
      text: `
        Hi ${userName},

        Thank you for signing up! To complete your verification, please use the One-Time Password (OTP) below:

        🔑 Your OTP: ${otp}

        Please enter this code on the verification page. The OTP is valid for the next 10 minutes, so make sure to complete your verification promptly.

        If you did not request this, please ignore this email. For any assistance, feel free to contact our support team.

        Best regards,
        Support Team
      `,
      html: `
        <p>Hi <b>${userName}</b>,</p>
        <p>Thank you for signing up! To complete your verification, please use the One-Time Password (OTP) below:</p>
        <h3>🔑 Your OTP: <b>${otp}</b></h3>
        <p>Please enter this code on the verification page. The OTP is valid for the next <b>10 minutes</b>, so make sure to complete your verification promptly.</p>
        <p>If you did not request this, please ignore this email. For any assistance, feel free to contact our support team.</p>
        <p>Best regards,<br/><b>Support Team</b></p>
      `,
    };

    
    const saltRounds = 10;
    const hashedOtp = await bcrypt.hash(otp.toString(), saltRounds);

    
    const newUserOtp = new userOtp({
      userId: userid,
      otp: hashedOtp,
      createdAt: Date.now(),
      expiredAt: Date.now() + 10 * 60 * 1000, 
    });

    await newUserOtp.save();

    
    await transporter.sendMail(mailOptions);

    return true; 
  } catch (error) {
    console.error('Error sending OTP email:', error.message);
    return false; 
  }
};

module.exports = { createUser };
