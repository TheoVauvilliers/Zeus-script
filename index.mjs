#!/usr/bin/env zx

require('dotenv').config();

import { client, collection } from './config/db.js';
import { getAllPaths, checkIntegrity, readFile } from './services/file.js';

// * LOG MEMORY USAGE EVERY 10s
setInterval(() => {
    console.log(`The script uses approximately ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100} MB`);
}, 10000);

/** @var {MongoClient} mongo client manager ready */
const mongo = await client();

/** @var {MongoClient} collection client manager */
const log = collection(mongo, process.env.MONGODB_DB_NAME, 'log');

/** @var {array} paths of the files */
const paths = getAllPaths(process.env.UPLOAD_PATH);

if (!checkIntegrity(paths)) {
    console.error(`Error: One file is not valid`);
    process.exit(1);
}

// Reset collection log
await log.deleteMany({});

for await (const path of paths) {
    console.log(`Processing file : ${path}`);
    await readFile(path, log);
    console.log(`--- ---- --- ---- ---`);
}
