import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

export const POST = async (req) => {
  const { email, password } = await req.json();
  const client = new MongoClient(process.env.MONGO_URI);

  try {
    await client.connect();
    const db = client.db(process.env.DATABASE);
    const collection = db.collection('Users');

    const user = await collection.findOne({ email },{ password: 0 });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 400 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid password' }, { status: 400 });
    }

    delete user.password;

    return NextResponse.json({ message: 'Login successful', user }, { status: 200 });
  } catch (error) {
    console.error('Error logging in user:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  } finally {
    await client.close();
  }
};
