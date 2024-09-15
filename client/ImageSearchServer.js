import express from 'express';
import multer from 'multer';
import axios from 'axios';
import { MongoClient } from 'mongodb';
import path from 'path';
import { unlinkSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';

// Initialize Express app
const app = express();
const port = process.env.PORT || 6000;

// Google Cloud Vision API key
const API_KEY = 'AIzaSyDeSwRBfHTJHuGQiHcO6UaQocK5JZWtTdE'; // Replace with your actual API key

// MongoDB connection details
const uri = 'mongodb+srv://thisalchandupa:thisal@cluster0.vd9pl.mongodb.net/';
const dbName = 'yourDatabaseName';
const collectionName = 'products';

// Multer setup for file upload
const upload = multer({ dest: 'uploads/' });

// Google Vision API URL
const VISION_API_URL = `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`;

// Helper to resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Image search endpoint
app.post('/api/search', upload.single('image'), async (req, res) => {
  try {
    const imagePath = path.join(__dirname, req.file.path);
    const imageBase64 = readFileSync(imagePath).toString('base64');

    // Send the image to Google Cloud Vision API
    const response = await axios.post(VISION_API_URL, {
      requests: [
        {
          image: {
            content: imageBase64
          },
          features: [
            { type: 'LABEL_DETECTION', maxResults: 10 }
          ]
        }
      ]
    });

    const labels = response.data.responses[0].labelAnnotations.map(label => label.description);

    // Connect to MongoDB and search for matching products
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const query = { tags: { $in: labels } };
    const matchingProducts = await collection.find(query).toArray();

    // Cleanup
    unlinkSync(imagePath); // Delete the uploaded file

    res.json(matchingProducts);
    await client.close();
  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).send('An error occurred while processing the image.');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
