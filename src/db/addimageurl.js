const fs = require('fs');

// Function to add imageURL field to each object in the array
function addImageURLToArray(dataArray) {
    return dataArray.map(item => {
        if (item.variants) {
            item.price = parseFloat(item.variants[0].price);
        } else {
            item.price = "";
        }
        return item;
    });
}

// Read the JSON file
fs.readFile('productsTech_Store.json', 'utf8', (err, data) => {
    if (err) {
        console.error("Error reading the file:", err);
        return;
    }
    
    try {
        // Parse the JSON data into an array
        let jsonArray = JSON.parse(data);
        
        // Update the array
        jsonArray = addImageURLToArray(jsonArray);
        
        // Convert the array back to a JSON string
        const updatedData = JSON.stringify(jsonArray, null, 4);
        
        // Write the updated JSON string back to the file
        fs.writeFile('productsTech_Store.json', updatedData, 'utf8', (err) => {
            if (err) {
                console.error("Error writing the file:", err);
                return;
            }
            console.log("File has been updated successfully.");
        });
        
    } catch (err) {
        console.error("Error parsing the JSON data:", err);
    }
});