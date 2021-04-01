const dotenv = require("dotenv");
dotenv.config();

const API_GEONAMES = process.env.API_GEONAMES;
const API_WEATHERBIT = process.env.API_WEATHERBIT;
let projectParameters = {
  API_GEONAMES: API_GEONAMES,
  API_WEATHERBIT: API_WEATHERBIT,
};
// Setup empty JS object to act as endpoint for all routes
let projectData = {};

// Require Express to run server and routes
const express = require("express");

// Start up an instance of app
const app = express();
/* Dependencies*/
const bodyParser = require("body-parser");
/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require("cors");
app.use(cors());

// Initialize the main project folder
//app.use(express.static("src/client"));
app.use(express.static("dist"));

app.get("/", function (req, res) {
  res.sendFile("/client/views/index.html", { root: __dirname + "/.." });
});
// Setup Server
const port = 3000;
const server = app.listen(port, () => {
  console.log(`running on localhost: ${port}`);
});

app.get("/get_parameters", (req, res) => {
  console.log(projectParameters);
  console.log(projectParameters.API_KEY);
  res.send(projectParameters);
});

app.get("/all", (req, res) => {
  res.send(projectData);
});

app.post("/add", (req, res) => {
  projectData = {
    date: req.body.date,
    city: req.body.city,
    temperature: req.body.temperature,
    userInput: req.body.userInput,
    weather: req.body.weather,
  };
});
