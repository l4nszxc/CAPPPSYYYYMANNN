const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'lanslorence@gmail.com', // Replace with your Gmail
        pass: 'dwha kvpo ogpk txmg' // Use an App Password from Google Account
    }
});

exports.sendOTP = async (email, otp) => {
    try {
        await transporter.sendMail({
            from: '"Your App" <your-email@gmail.com>',
            to: email,
            subject: "Email Verification OTP",
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
                    <h2>Email Verification</h2>
                    <p>Your OTP for email verification is:</p>
                    <h1 style="color: #4CAF50; font-size: 32px;">${otp}</h1>
                    <p>This OTP will expire in 10 minutes.</p>
                </div>
            `
        });
    } catch (error) {
        throw error;
    }
};