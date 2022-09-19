#!/usr/bin/env zx

import { checkFile, readFile } from './services/file.js';

// Check if file exist
const file = checkFile();

if (file) {
    await $`echo "File is found"`;
} else {
    await $`echo "File not found, please read the REAME.md"`;
    await $`exit 1`;
}

// Get the content of the file
const content = await readFile(file);

content.forEach(async (line, index) => {
    if (index > 100) {
        return;
    }
    const data = `${index}- ${line.timestamp}, ${line.timestamp}, ${line.pixel_color}, ${line.coordinate}`;
    await $`echo "${data}"`;
});
