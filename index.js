'use strict';

/**
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  console.log("Hello world received a request.");

  const target = process.env.TARGET || "World";
  res.send(`Hello ${target}!`);
});

app.post("/payload", (req, res) => {

  console.log("Hello world received a request.");

  const target = process.env.TARGET || "World";
  res.send(200);
});

const port = process.env.PORT || 9999;
app.listen(port, () => {
  console.log("Hello world listening on port", port);
});
 **/

 const { api } = require('./server');

 // start the api
 api.start(); /// -> Error 500 ?
