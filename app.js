const express = require("express");
var path = require("path");

const app = express();

const fs = require("fs");
const csv = require("csv-parser");
const inputFilePath = "./Data.csv";

const storeData = [];

// Read CSV
fs.createReadStream(inputFilePath)
  .pipe(csv())
  .on("data", function(data) {
    try {
      storeData.push(data);
      //perform the operation
    } catch (err) {
      //error handler
    }
  })
  .on("end", function() {
    //some final operation
  });

// Data endpoint
app.get("/listings", (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || storeData.length;
  const name = req.query.name;

  const firstIndex = (page - 1) * limit;

  res.json(
    storeData
      .filter(datum => (name ? datum.name.includes(name) : true))
      .slice(firstIndex, firstIndex + limit)
  );
});

// Render frontend
app.get("/", (req, res, next) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});

//export app
module.exports = app;
