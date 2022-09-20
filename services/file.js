require('dotenv').config();

import fs from 'fs';

/**
 * Check if the file data.csv exist in the upload directory
 * @returns {string|boolean} string if the file exist, false if not
 */
export const checkFile = () => fs.existsSync(process.env.CSV_FILE_PATH) ? process.env.CSV_FILE_PATH : false;