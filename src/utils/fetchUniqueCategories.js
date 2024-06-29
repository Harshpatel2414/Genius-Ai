import { MongoClient } from 'mongodb';

const mongoURI = process.env.MONGO_URI;

const fetchUniqueCategories = async (store) => {
    const client = new MongoClient(mongoURI);

    try {
        await client.connect();
        const db = client.db(process.env.DATABASE);
        const collection = db.collection(store);

        const allTags = await collection.distinct('tags');
        const uniqueTags = new Set();

        allTags.forEach(tags => {
            tags.split(',').forEach(tag => {
                uniqueTags.add(tag.trim());
            });
        });

        return Array.from(uniqueTags);
    } catch (error) {
        console.error('Error fetching unique categories:', error);
        return [];
    } finally {
        await client.close();
    }
}

export default fetchUniqueCategories;