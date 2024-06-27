import { MongoClient, ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

export const POST = async (req) => {
    try {
        const { product, userId } = await req.json();

        if (!product || !userId) {
            return NextResponse.json({ message: 'Invalid request parameters' }, { status: 400 });
        }

        const client = new MongoClient(process.env.MONGO_URI);

        await client.connect();
        const db = client.db(process.env.DATABASE);
        const collection = db.collection('Users');

        // Check if product already exists in favorites array
        const existingProduct = await collection.findOne({
            _id: new ObjectId(userId),
            'favorites.id': product.id
        });

        if (existingProduct) {
            await client.close();
            return NextResponse.json({ message: 'Product already in favorites' }, { status: 409 });
        }

        // If product does not exist in favorites, push it
        const result = await collection.updateOne(
            { _id: new ObjectId(userId) },
            {
                $push: {
                    favorites: {
                        $each: [{ ...product, created_at: new Date() }],
                        $position: 0 
                    }
                }
            }
        );

        await client.close();

        if (result.modifiedCount === 0) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            message: 'Product added to favorites successfully'
        }, { status: 200 });
    } catch (error) {
        console.error('Error while adding product to favorites:', error);
        return NextResponse.json({
            message: 'Error while adding product to favorites'
        }, { status: 500 });
    }
};
