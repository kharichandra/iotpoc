const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware to parse JSON requests
app.use(bodyParser.json());

app.post('/webhook-endpoint', (req, res) => {
    console.log('Webhook received:', req.body);

    // Handle the webhook data as needed
    // For example, you could trigger an action or send a response

    res.status(200).send('Webhook received successfully');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
