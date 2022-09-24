#!/usr/bin/env zx

require('dotenv').config();

import { client, collection } from './config/db.js';
import { getAllPaths, checkIntegrity, readFile } from './services/file.js';

// LOG MEMORY USAGE EVERY 10s
setInterval(() => {
    console.log(`The script uses approximately ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100} MB`);
}, 10000);

console.log('Connecting to database...');
console.log(process.env.DATABASE_URL);
/** @var {MongoClient} mongo client manager ready */
const mongo = await client();
console.log('Connected to database');

console.log('Connecting to collection...');
/** @var {MongoClient} collection client manager */
const log = collection(mongo, process.env.MONGODB_DB_NAME, 'log');
console.log('Connected to collection');

/** @var {array} paths of the files */
const paths = getAllPaths('public/upload/');

if (!checkIntegrity(paths)) {
    console.error(`Error: One file is not valid`);
    process.exit(1);
}

// Reset collection log
await log.deleteMany({});
console.log('Collection log reset');

for await (const path of paths) {
    console.log(`Processing file : ${path}`);
    await readFile(path, log);
    console.log(`--- ---- --- ---- ---`);
}
