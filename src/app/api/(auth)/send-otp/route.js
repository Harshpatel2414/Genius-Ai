import { MongoClient } from 'mongodb';
import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

export const POST = async (req) => {
  const { email } = await req.json();
  const client = new MongoClient(process.env.MONGO_URI);
  const otp = generateOTP();

  try {
    await client.connect();
    const db = client.db(process.env.DATABASE);
    const collection = db.collection('Users');

    const user = await collection.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: 'User not found! Enter valid email' }, { status: 400 });
    }

    // Store OTP in the database
    await collection.updateOne(
      { email },
      { $set: { otp, otpExpiresAt: new Date(Date.now() + 2 * 60 * 1000) } } // OTP valid for 2 minutes
    );

    // Send OTP to user's email
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.NODEMAIL_EMAIL,
        pass: process.env.NODEMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: "geniusai@gmail.com",
      to: email,
      subject: 'Genius-AI OTP for Password Reset',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 20px auto;
              padding: 20px;
              background-color: #ffffff;
              border-radius: 8px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .header {
                display: flex;
                align-items: center;
                color: #3b82f6;
                gap: 10px;
                margin-bottom: 20px;
            }
            .header img {
              width: 50px;
              height: 50px;
            }
            .message {
              font-size: 16px;
              color: #333333;
              line-height: 1.5;
              margin-bottom: 20px;
            }
            .otp {
              font-size: 24px;
              font-weight: bold;
              background-color: #f9f9f9;
              padding: 10px;
              border-radius: 4px;
              text-align: center;
              margin-bottom: 20px;
            }
            .warning {
              font-size: 14px;
              color: #ff0000;
              margin-bottom: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="http://genius-ai-rust.vercel.app/icon.png" alt="GeniusAI Logo">
              <h1>GeniusAI</h1>
            </div>
            <div class="message">
              Your OTP for password reset is:
            </div>
            <div class="otp">
              ${otp}
            </div>
            <div class="warning">
              Do not share this OTP with anyone. It is valid for 2 minutes.
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'OTP sent to email' }, { status: 200 });
  } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  } finally {
    await client.close();
  }
};