import fs from 'fs';
import { parse } from "csv-parse";

/**
 * Check if the file data.csv exist in the upload directory
 * @returns {string | boolean} string if the file exist, false if not
 */
export const checkFile = () => {
    const path = "./upload/data.csv";

    if (fs.existsSync(path)) {
        return path;
    } else {
        return false;
    }
};

/**
 * Read csv file and return the content as an array
 * @param {string} path path
 * @param {string} delimiter
 * @returns {array} content of the csv
 */
export const readFile = async (path, delimiter = ",") => {
    await $`echo "Start reading ${path} file"`;

    let arr = [];

    fs.createReadStream(path)
    .pipe(
        parse({
            delimiter: delimiter,
            columns: true,
        })
    )
    .on("data", function (row) {
        arr.push(row);
    })
    .on("error", function (err) {
        echo(err.message);
    })

    await $`echo "End reading ${path} file"`;

    return arr;
}