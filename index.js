const serverless = require('serverless-http');
const express = require('express');
const app = express();

const scraping = require('./scrape');

app.get('/', function (req, res) {
  scraping.scrapeEvents().then(function(data) {
      res.status(200).json(data);
  }, function(err) {
      res.status(400).json(err);
  });
});


module.exports.handler = serverless(app);
