'use strict';

// node generate-doc.js
const docAdapter = require('./lib/adapter/doc-adapter');

async function generateDoc() {
  const doc = await docAdapter('thefork-api');
  console.log(JSON.stringify(doc, null, 2));

  process.exit(0);
}

generateDoc();
