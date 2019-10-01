'use strict';

module.exports = {
  get: (req) => {
    console.log("Hello world received a request.");
    //console.dir(req);
    //console.dir(res);

    const target = process.env.TARGET || "World";

    return `Hello ${target}!`;
    },
  post: (req) => {
    console.log("toto");
    //console.log(req);
    //console.log(res);

    const target = process.env.TARGET || "World";

    return `Hello ${target}!`;
  },
};
