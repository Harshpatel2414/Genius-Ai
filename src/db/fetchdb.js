// const fs = require('fs');

// async function fetchAndSaveData(apiUrl) {
//   try {
//     // Make the API call
//     const response = await fetch(apiUrl);

//     // Get the response data
//     const {products } = await response.json();

//     // const jsonData = JSON.stringify(data, null, 2);
//     let existingData = [];
   
//     const rawData = fs.readFileSync("new_products.json");
//     existingData = JSON.parse(rawData);
//     console.log("existingData len >>>", existingData.length)
    
//     const updatedData = existingData.concat(products)
//     console.log("existingData len >>>", updatedData.length)
//     // // Save the JSON string to the output file
//     fs.writeFile("new_products.json", JSON.stringify(updatedData), (err) => {
//       if (err) {
//         console.error('Error writing to file', err);
//       } else {
//         console.log('Data saved');
//       }
//     });
//   } catch (error) {
//     console.error('Error fetching data', error);
//   }
// }

// fetchAndSaveData('https://dummyjson.com/products?skip=180');


const { MongoClient } = require('mongodb');
const fs = require('fs');

const fetchAndSaveData = async () => {
    const client = new MongoClient('your_mongo_uri_here', { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await client.connect();
        const db = client.db('your_database_name');
        const collection = db.collection('your_collection_name');

        // Fetch all documents from the collection
        const data = await collection.find({}).toArray();

        // Convert the data to JSON string
        const jsonData = JSON.stringify(data, null, 4);

        // Write the JSON string to a file
        fs.writeFile('output.json', jsonData, 'utf8', (err) => {
            if (err) {
                console.error('Error writing the file:', err);
                return;
            }
            console.log('Data has been saved to output.json');
        });

    } catch (error) {
        console.error('Error fetching data:', error);
    } finally {
        await client.close();
    }
};

fetchAndSaveData();

