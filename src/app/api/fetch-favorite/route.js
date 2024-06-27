import { MongoClient, ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

export const POST = async (req) => {
    try {
        const { userId } = await req.json();

        if (!userId) {
            return NextResponse.json({ message: 'Invalid request parameters' }, { status: 400 });
        }

        const client = new MongoClient(process.env.MONGO_URI);

        await client.connect();
        const db = client.db(process.env.DATABASE);
        const collection = db.collection('Users');

        const user = await collection.findOne(
            { _id: new ObjectId(userId) },
            {
                projection: { favorites: 1, _id: 0 },
                sort: { "favorites.created_at": -1 }
            }
        );
        
        await client.close();

        const favorites = user.favorites || []

        return NextResponse.json({ favorites }, { status: 200 });
    } catch (error) {
        console.error('Error while fetching favorites:', error);
        return NextResponse.json({
            message: 'Error while fetching favorites',
        }, { status: 500 });
    }
};
