'use strict';

module.exports = {
  get: (req, res) => {
    console.log("Hello world received a request.");

    const target = process.env.TARGET || "World";
    res.send(`Hello ${target}!`);
  },
  post: (req, res) => {
    console.log("Hello world received a request.");

    const target = process.env.TARGET || "World";
    res.send(200);
  },
};
