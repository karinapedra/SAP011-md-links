#!/usr/bin/env node

const { program } = require('commander');
const readFile = require('./index');
const chalk = require('chalk');
const log = console.log;

program.version('1.0.0');

program
  .command('read-file <file-name>')
  .description('Read the content of a file')
  .action((fileName) => {
    readFile(fileName)
      .then((results) => {
        results.forEach((result) => {
          if (result.error) {
            const formattedResult = `${chalk.red.bold('[Invalid]')}: ${result.url}`;
            log(formattedResult);
          } else {
            const formattedResult = `${chalk.green.bold('[Valid]')}: ${result.url}`;
           log(formattedResult);
          }
        });
      })
      .catch((error) => {
        console.error('An error occurred:', error.message);
      });
  });

program.parse(process.argv);
