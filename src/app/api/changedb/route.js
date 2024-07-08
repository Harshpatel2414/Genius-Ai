import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

const uri = process.env.MONGO_URI;

export async function GET(req) {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db("products");
        const collection = db.collection("ZEV_update");

        // Update all documents to rename body_html to description
        const result = await collection.updateMany(
            { category: { $exists: true } },
            [
                {
                    $set: { tags: "$category"}
                },
                {
                    $unset: "category"
                }
            ]
        );

        return NextResponse.json({
            message: 'Update successful',
            matchedCount: result.matchedCount,
            modifiedCount: result.modifiedCount
        });

    } catch (error) {
        console.error('Error updating documents:', error);
        return NextResponse.json({
            error: 'Error updating documents',
            details: error.message
        }, { status: 500 });
    } finally {
        await client.close();
    }
}

/// pages/api/update-price.js
// import { MongoClient } from 'mongodb';
// import { NextResponse } from 'next/server';

// const uri = process.env.MONGO_URI;

// export async function POST(req) {
//     const client = new MongoClient(uri);

//     try {
//         await client.connect();
//         const db = client.db('products');
//         const collection = db.collection('Products');

//         // Example update operation: Convert 'price' field from string to float
//         const result = await collection.updateMany(
//             {},
//             [
//                 {
//                     $set: {
//                         variants: {
//                             $map: {
//                                 input: '$variants',
//                                 as: 'variant',
//                                 in: {
//                                     $mergeObjects: [
//                                         '$$variant',
//                                         { price: { $toDouble: '$$variant.price' } }
//                                     ]
//                                 }
//                             }
//                         }
//                     }
//                 }
//             ]
//         );

//         return NextResponse.json({
//             message: 'Update successful',
//             matchedCount: result.matchedCount,
//             modifiedCount: result.modifiedCount
//         });

//     } catch (error) {
//         console.error('Error updating documents:', error);
//         return NextResponse.json({
//             error: 'Error updating documents',
//             details: error.message
//         }, { status: 500 });
//     } finally {
//         await client.close();
//     }
// }
