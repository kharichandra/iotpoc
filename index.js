const express = require("express");
const bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit");
const axios = require("axios");
const { Pool } = require("pg");

const app = express();
const port = 5000;
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 requests per windowMs
});

const connectionString =
  "postgres://iotdata_user:RQoG061drVVToSVrSfvhlWugljwRZTFE@dpg-cmii6of109ks739m3cng-a.oregon-postgres.render.com/iotdata?sslmode=require";

const pool = new Pool({
  connectionString: connectionString,
});

// Request count for the specific endpoint
let endpoint1RequestCount = 0;

// Threshold for anomaly detection
const anomalyThreshold = 2;

// Middleware to parse JSON requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Apply rate limiting middleware to all routes
// app.use(limiter);
// Handling GET /hello request

app.use("/receive-data",limiter, (req, res, next) => {
  // Increment the request count for "receive-data"
  const postData = req.body;
  if (postData.pinKey === "V3") {
    endpoint1RequestCount++;
  } else {
    endpoint1RequestCount = 0;
  }

  // Check for anomalies for "receive-data"
  if (endpoint1RequestCount > anomalyThreshold) {
    console.log(
      "Potential anomaly detected for receive-data! Too many requests."
    );
    return res
      .status(430)
      .json({
        message:
          "Potential anomaly detected for Pin Key :V3 Too many requests.",
      });
    // You can take further actions here, such as logging the incident or blocking the IP.
  }

  next();
});

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
