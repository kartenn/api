const populateAll = require('./lib/handlers/populate-all');

async function populateDb() {
  await populateAll();
  process.exit(0);
}

populateDb();
