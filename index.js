const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = 5000;

// Middleware to parse JSON requests
app.use(bodyParser.json());
// Handling GET /hello request 
app.get("/hello", (req, res, next) => { 
    // res.send("This is the hello response"); 
      // Assuming the data you want to send is in the request body
  const postData = req.body;

  // Replace 'https://example.com/api' with the actual URL of the external API
  const apiUrl = 'https://dummy.restapiexample.com/api/v1/employees';

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
app.post('/receive-data', (req, res) => {
    const dataFromSimulator = req.body;
    console.log('Received data from Wokwi simulator:', dataFromSimulator);

    // Process the received data, e.g., store in a database, trigger actions, etc.

    res.status(200).send('Data received successfully');
});

app.listen(port, () => {
    console.log(`Backend server running on http://localhost:${port}`);
});
