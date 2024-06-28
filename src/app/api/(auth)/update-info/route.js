import { MongoClient, ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

export const POST = async (req) => {
    const { userId, username, email, image, gender, agreeTerms } = await req.json();

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

        // Update fields if they are provided
        if (username) {
            user.username = username;
        }
        if (email) {
            user.email = email;
        }
        if (image) {
            user.image = image;
        }
        if (gender !== undefined) {
            user.gender = gender;
        }
        if (agreeTerms !== undefined) {
            user.agreeTerms = agreeTerms;
        }

        // Update the user in the database
        await collection.updateOne({ _id: new ObjectId(userId) }, { $set: user });

        // Fetch updated user data
        const updatedUser = await collection.findOne({ _id: new ObjectId(userId) }, { projection: { password: 0, favorites: 0 } });

        return new Response(JSON.stringify({ message: 'User information updated successfully', user: updatedUser }), { status: 200 });
    } catch (error) {
        console.error('Error updating user:', error);
        return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
    } finally {
        await client.close();
    }
};
