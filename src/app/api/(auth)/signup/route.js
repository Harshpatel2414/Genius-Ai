// import { MongoClient } from 'mongodb';
// import bcrypt from 'bcrypt';

// export const POST = async (req) => {
//   const { email, password, confirmPassword, image } = await req.json();

//   if (password !== confirmPassword) {
//     return new Response(JSON.stringify({ message: 'Passwords do not match' }), { status: 400 });
//   }

//   try {
//       const client = new MongoClient(process.env.MONGO_URI);
//     await client.connect();
//     const db = client.db(process.env.DATABASE);
//     const collection = db.collection("Users");

//     const user = await collection.findOne({ email });

//     if (user) {
//       return new Response(JSON.stringify({ message: 'User already exists' }), { status: 400 });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = { email, password: hashedPassword, image };

//     await collection.insertOne(newUser);
//     return new Response(JSON.stringify({ message: 'User created successfully' }), { status: 201 });
//   } catch (error) {
//     console.error('Error creating user:', error);
//     return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
//   } finally {
//     await client.close();
//   }
// };


import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';

export const POST = async (req) => {
  const { username, email, password, image } = await req.json();

  const client = new MongoClient(process.env.MONGO_URI);
  try {
    await client.connect();
    const db = client.db(process.env.DATABASE);
    const collection = db.collection('Users');

    const existingUser = await collection.findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ message: 'User already exists' }), { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { username, email, password: hashedPassword, image };

    await collection.insertOne(newUser);

    const user = await collection.findOne({ email },{ password: 0 });

    return new Response(JSON.stringify({ message: 'User created successfully', user}), { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  } finally {
    await client.close();
  }
};
