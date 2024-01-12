const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = 5000;

// Middleware to parse JSON requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Handling GET /hello request 
app.post("/receive-data", (req, res, next) => { 
const postData = req.body;

const hostname = 'blr1.blynk.cloud';
const path = '/external/api/update';
const queryParams = `token=epNWp5yKhqckSi01-6hZGfsi-_7SJblG&${postData.pinKey}=${postData.pinValue}`;

const apiUrl = `https://${hostname}${path}?${queryParams}`;

  // Make a POST request to the external API
  axios.get(apiUrl)
    .then(response => {
      console.log('API Response:', response.data);
      // Handle the API response as needed
      res.status(200).json({ message: 'Success' });
    })
    .catch(error => {
      console.error('Error:', error.message);
      // Handle errors
      res.status(500).json({ error: 'Internal Server Error' });
    });
}) 

// Endpoint to receive data from Wokwi simulator
app.post('/test', (req, res) => {
    const dataFromSimulator = req.body;
    console.log('Received data from Wokwi simulator:', dataFromSimulator);

    // Process the received data, e.g., store in a database, trigger actions, etc.

    res.status(200).send('Data received successfully');
});

app.listen(port, () => {
    console.log(`Backend server running on http://localhost:${port}`);
});
