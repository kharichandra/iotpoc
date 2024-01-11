const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

// Middleware to parse JSON requests
app.use(bodyParser.json());
// Handling GET /hello request 
app.get("/hello", (req, res, next) => { 
    res.send("This is the hello response"); 
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
