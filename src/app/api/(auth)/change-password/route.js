import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';

export const POST = async (req, res) => {

    const { userId, oldPassword, newPassword } = await req.json();

    // Check if the new hashed password is the same as the current password
    if (oldPassword === newPassword) {
        return NextResponse.json({ message: 'Use a different password, you have already used it!' }, { status: 400 });
    }
    const client = new MongoClient(process.env.MONGO_URI);

    try {
        await client.connect();
        const db = client.db(process.env.DATABASE);
        const collection = db.collection('Users');

        // Find the user by userId
        const user = await collection.findOne({ _id: new ObjectId(userId) });

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }
        
        // Compare old password with the stored hashed password
        const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordMatch) {
            return NextResponse.json({ message: 'Old password is incorrect' }, { status: 400 });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update user's password in the database
        await collection.updateOne({ _id: new ObjectId(userId) }, { $set: { password: hashedPassword } });

        return NextResponse.json({ message: 'Password updated successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error updating password:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    } finally {
        await client.close();
    }
}
