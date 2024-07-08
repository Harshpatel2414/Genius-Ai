import { MongoClient } from "mongodb";

const fetchProductWithVector = async (vector, maxPrice = Infinity,store) => {
    const client = new MongoClient(process.env.MONGO_URI);
    try {
        await client.connect();
        const db = client.db("products");
        const collection = db.collection(store);

        const pipeline = [
            {
                "$vectorSearch": {
                    "queryVector": vector,
                    "path": "embedding",
                    "numCandidates": 768,
                    "limit": 5,
                    "index": store,
                }
            },
            {
                $addFields: {
                    firstVariant: { $arrayElemAt: ["$variants", 0] }
                }
            }
        ];

        // Only add the price match stage if maxPrice is defined and is a valid number
        if (maxPrice !== Infinity) {
            pipeline.push({
                $match: {
                    $or: [
                        { "price": { $exists: true, $lte: maxPrice } },
                        { "firstVariant.price": { $lte: maxPrice } }
                    ]
                }
            });
        }

        pipeline.push({
            $project: {
                id: 1,
                title: 1,
                description: 1,
                imageUrl: 1,
                price: {
                    $cond: {
                        if: { $eq: ["$price", undefined] },
                        then: "$firstVariant.price",
                        else: "$price"
                    }
                }
            }
        });

        const results = await collection.aggregate(pipeline).toArray();        
        return results;
    } catch (error) {
        console.error('Error fetching products:', error);
        return null;
    } finally {
        await client.close();
    }
};

export default fetchProductWithVector;

