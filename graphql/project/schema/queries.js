'use strict';

module.exports = {
  Query: {
    helloWorld: async (root, {input}, {}) => {
      const target = process.env.TARGET || "World";
      console.log("Hello world received a request.");

      return `Hello ${target}!`;
    },
  },
};
