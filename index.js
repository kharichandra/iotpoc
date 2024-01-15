const express = require('express');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const axios = require('axios');

const app = express();
const port = 5000;
const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5, // limit each IP to 10 requests per windowMs
  });

// Middleware to parse JSON requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Apply rate limiting middleware to all routes
app.use(limiter);
// Handling GET /hello request 
app.post("/receive-data", (req, res, next) => { 
const postData = req.body;
if(postData.pinKey == "V4"){
    return res.status(400).send('Today being a holiday, requests are not permitted.');
}
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
