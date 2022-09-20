#!/usr/bin/env zx

require('dotenv').config();

import fs from 'fs';
import { client, collection } from './config/db.js'
import { insertRow } from './services/db.js'
import { checkFile } from './services/file.js';
import { parse } from "csv-parse";

/** @var { MongoClient } mongo client manager ready */
const mongo = await client();

/** @var { MongoClient } collection client manager */
const log = collection(mongo, process.env.MONGODB_DB_NAME, 'log');

/** @var { string | boolean } path of the file or false if not exist */
const path = checkFile();

if (path) {
    echo("File is found");
} else {
    echo("File not found, please read the REAME.md");
    await $`exit 1`;
}

// ! TODO : Delete all lines
log.deleteMany({});

await new Promise((resolve, reject) => {

    const promises = [];
    let rows_processed = 0;

    fs.createReadStream(path)
        .pipe(parse({ delimiter: ',', columns: true }))
        .on("data", (row) => {
            promises.push(insertRow(log, row))
            rows_processed++;
        })
        .on("error", reject)
        .on("end", async () => {
            await Promise.all(promises);
            resolve();
                echo(`Process completed, ${rows_processed} rows processed`);
        });
});

await mongo.close();
