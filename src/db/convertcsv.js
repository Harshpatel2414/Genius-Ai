const fs = require('fs');


function parseField(field) {
    if (field === undefined || field === null) {
        return field;
    }

    try {
        const parsed = JSON.parse(field);
        if (Array.isArray(parsed) || typeof parsed === 'object') {
            return parsed;
        }
    } catch (e) {
        // Not a JSON string, fall through
    }

    // Check for potential array format without JSON parsing
    if (field.startsWith('[') && field.endsWith(']')) {
        try {
            return JSON.parse(field.replace(/'/g, '"'));
        } catch (e) {
            // If it fails, return the field as is
        }
    }

    return field;
}

function convertCsvToJson(csvFilePath, jsonFilePath) {
    fs.readFile(csvFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file', err);
            return;
        }

        const lines = data.split('\n').filter(line => line.trim() !== '');
        const result = [];

        // Assuming the first line is the header
        const headers = lines[0].split(';').map(header => header.trim());

        for (let i = 1; i < lines.length; i++) {
            const obj = {};
            const currentline = lines[i].split(';').map(field => field.trim());

            for (let j = 0; j < headers.length; j++) {
                obj[headers[j]] = parseField(currentline[j]);
            }

            result.push(obj);
        }

        const jsonData = JSON.stringify(result, null, 2);
        fs.writeFile(jsonFilePath, jsonData, (err) => {
            if (err) {
                console.error('Error writing to file', err);
            } else {
                console.log('Data saved to', jsonFilePath);
            }
        });
    });
}

// Example usage
const csvFilePath = 'shein_sample.csv';
const jsonFilePath = 'output.json';

convertCsvToJson(csvFilePath, jsonFilePath);
