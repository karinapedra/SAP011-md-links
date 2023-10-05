#!/usr/bin/env node

const { program } = require('commander');
const fs = require('fs');
const readline = require('readline');
// const fetch = require('node-fetch');

program.version('1.0.0');

program
    .command('read-file <file-name>')
    .description('Read the content of a file')
    .action((fileName) => {
        readFile(fileName);
    });

function readFile(fileName) {
    const fileStream = fs.createReadStream(fileName, 'utf8');
    const linkRegex = /https?:\/\/\S+/g;
    const results = [];

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
    });
    rl.on('line', (line) => {
        const links = line.match(linkRegex);
        if (links) {
            links.forEach((link) => {
                fetch(link)
                    .then((response) => {
                        results.push({
                            url: link,
                            status: response.status,
                            statusText: response.statusText,
                        });
                        console.log(`Valid: ${link}`);
                    })
                    .catch((error) => {
                        results.push({
                            url: link,
                            error: error.message,
                        });
                        console.log(`Not valid: ${link}`);
                    });
            });
            rl.on('close', () => {
            });
        } 
    });
}
program.parse(process.argv);

