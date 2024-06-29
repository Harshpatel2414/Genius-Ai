import { MongoClient } from 'mongodb';

const mongoURI = process.env.MONGO_URI;

const fetchProductDetails = async (ids, store) => {
    const client = new MongoClient(mongoURI);

    try {
        await client.connect();
        const db = client.db(process.env.DATABASE)
        const collection = db.collection(store);
        const documents = await collection.find({ id: { $in: ids } }).toArray();
        return documents;
    } catch (error) {
        console.error('Error fetching product details:', error);
        return null;
    } finally {
        await client.close();
    }
}

export default fetchProductDetails;