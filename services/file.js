import fs from 'fs';
import { insertRow } from './db.js';
import { parse } from "csv-parse";

/**
 * Return an array of paths for each file in the directory (recursive)
 * @param {string} path from which to retrieve all files in all folders
 * @return {array} array of string
 */
export const getAllPaths = (path) => {
    let allPathsListed = [];

    fs.readdirSync(path).forEach(dirName => {
        const newPath = path + dirName;

        if (fs.statSync(newPath).isFile()) {
            allPathsListed = [...allPathsListed, newPath];
        } else {
            allPathsListed = [...allPathsListed, ...getAllPaths(newPath + '/')];
        }
    });

    return allPathsListed;
};

/**
 * 
 * @param {array} filePaths 
 * @return {boolean} true if valid files, otherwise false
 */
export const checkIntegrity = (filePaths) => {
    // TODO : Do this function
    return true;
};

export const readFile = async (path, collection) => {
    await new Promise((resolve, reject) => {
        const promises = [];
        let rows_processed = 0;

        fs.createReadStream(path)
            .pipe(parse({ delimiter: ',', columns: true }))
            .on("data", (row) => {
                promises.push(insertRow(row, collection));
                rows_processed++;
            })
            .on("error", reject)
            .on("end", async () => {
                await Promise.all(promises);
                resolve();
                console.log(`Process completed for ${path}, ${rows_processed} rows processed`);
            });
    });
};
