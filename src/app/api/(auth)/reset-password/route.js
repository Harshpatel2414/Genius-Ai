import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

export const POST = async (req) => {
  const { email, otp, newPassword } = await req.json();
  const client = new MongoClient(process.env.MONGO_URI);

  try {
    await client.connect();
    const db = client.db(process.env.DATABASE);
    const collection = db.collection('Users');

    const user = await collection.findOne({ email });
    if (!user || user.otp !== otp || new Date() > new Date(user.otpExpiresAt)) {
      return NextResponse.json({ message: 'Invalid or expired OTP' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await collection.updateOne(
      { email },
      { $set: { password: hashedPassword, otp: null, otpExpiresAt: null } }
    );

    return NextResponse.json({ message: 'Password reset successful' }, { status: 200 });
  } catch (error) {
    console.error('Error resetting password:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  } finally {
    await client.close();
  }
};
