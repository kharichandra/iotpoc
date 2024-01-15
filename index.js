const express = require("express");
const bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit");
const axios = require("axios");
const { Pool } = require("pg");

const app = express();
const port = 5000;
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // limit each IP to 10 requests per windowMs
});

// Replace these values with your actual database credentials
// const pool = new Pool({
//     user: 'iotdata_user',
//     host: 'dpg-cmii6of109ks739m3cng-a.oregon-postgres.render.com',
//     database: 'iotdata',
//     password: 'RQoG061drVVToSVrSfvhlWugljwRZTFE',
//     port: 5432, // Default PostgreSQL port
//   });

// const connectionString = 'postgres://username:password@host:port/database?sslmode=require';
const connectionString =
  "postgres://iotdata_user:RQoG061drVVToSVrSfvhlWugljwRZTFE@dpg-cmii6of109ks739m3cng-a.oregon-postgres.render.com/iotdata?sslmode=require";

const pool = new Pool({
  connectionString: connectionString,
});

// Middleware to parse JSON requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Apply rate limiting middleware to all routes
app.use(limiter);
// Handling GET /hello request
app.post("/receive-data", async (req, res, next) => {
  const postData = req.body;
  try {
    const result = await pool.query("SELECT * FROM iotdevicedata");
    const rows = result.rows;
    (pinkey = ""), (pindate = new Date("2024-01-14T18:30:00:000Z"));
    // Iterate over rows
    rows.forEach((row) => {
      console.log(row);
      pinkey = row.pinkey;
      if (pinkey == postData.pinKey) {
        pindate = row.pindate;
      }
    });
    pindate1 = new Date("2024-01-21T12:00:00");
    if (pindate1.setHours(0, 0, 0, 0) === pindate.setHours(0, 0, 0, 0)) {
      return res
        .status(400)
        .send("Today being a holiday, requests are not permitted.");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }

  const hostname = "blr1.blynk.cloud";
  const path = "/external/api/update";
  const queryParams = `token=epNWp5yKhqckSi01-6hZGfsi-_7SJblG&${postData.pinKey}=${postData.pinValue}`;

  const apiUrl = `https://${hostname}${path}?${queryParams}`;

  // Make a POST request to the external API
  axios
    .get(apiUrl)
    .then((response) => {
      console.log("API Response:", response.data);
      // Handle the API response as needed
      res.status(200).json({ message: "Success" });
    })
    .catch((error) => {
      console.error("Error:", error.message);
      // Handle errors
      res.status(500).json({ error: "Internal Server Error" });
    });
});

// Endpoint to receive data from Wokwi simulator
app.post("/test", (req, res) => {
  const dataFromSimulator = req.body;
  console.log("Received data from Wokwi simulator:", dataFromSimulator);

  // Process the received data, e.g., store in a database, trigger actions, etc.

  res.status(200).send("Data received successfully");
});

app.post("/fetchData", async (req, res) => {
  const postData = req.body;
  try {
    const result = await pool.query("SELECT * FROM iotdevicedata");
    const rows = result.rows;
    (pinkey = ""), (pindate = new Date("2024-01-14T18:30:00:000Z"));
    // Iterate over rows
    rows.forEach((row) => {
      console.log(row);
      pinkey = row.pinkey;
      if (pinkey == postData.pinKey) {
        pindate = row.pindate;
      }
    });
    pindate1 = new Date("2024-01-21T12:00:00");
    if (pindate1.setHours(0, 0, 0, 0) === pindate.setHours(0, 0, 0, 0)) {
      return res
        .status(400)
        .send("Today being a holiday, requests are not permitted.");
    }
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
function isNullOrEmpty(str) {
  return str === null || str === undefined || str.trim() === "";
}
