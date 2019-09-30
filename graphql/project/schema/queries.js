'use strict';

module.exports = {
  Query: {
    helloWord: async (root, {input}, {}) => {
      const target = process.env.TARGET || "World";
      console.log("Hello world received a request.");

      return `Hello ${target}!`;
    },
  },
};
