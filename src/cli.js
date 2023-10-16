const mdLinks = require('./index');
const yargs = require('yargs');
const chalk = require('chalk');
const log = console.log;

const argv = yargs
  .command('read-file', 'Read and analyze links in a Markdown file', (yargs) => {
    yargs
      .positional('file', {
        describe: 'Path to the Markdown file',
        type: 'string',
      })
      .option('validate', {
        describe: 'Validate the status of each link',
        type: 'boolean',
        default: false,
      })
      .option('stats', {
        describe: 'Show statistics about the links',
        type: 'boolean',
        default: false,
      });
  })
  .help().argv;

const fileToRead = argv._[1];
const options = {
  validate: argv.validate,
  stats: argv.stats,
};

mdLinks(fileToRead, options)
  .then((results) => {
    if (results.links.length === 0) {
      log('No links found in the Markdown file.');
    } else {
      let validLinks = 0;
      let invalidLinks = 0;

      results.links.forEach((result) => {
        if (options.validate) {
          if (result.ok) {
            validLinks++;
            log(`${chalk.green.bold('[Valid]')}: ${result.href}`);
            log(`${chalk.yellowBright.bold('[Text]')}: ${result.text}`);
            if (result.title) {
              log(`${chalk.blueBright.bold('[Title]')}: ${chalk.whiteBright(result.title)}`);
            }
            log(`${chalk.bold('[Status]')}: ${chalk.greenBright.bold(result.status)}`);
            log('');
          } else {
            invalidLinks++;
            console.error(`${chalk.red.bold('[Invalid]')}: ${chalk.whiteBright(result.href)}`);
            console.error(`${chalk.bold('[Status]')}: ${chalk.redBright.bold(result.status)}`);
            log('');
          }
        } else {
          log(`${chalk.blueBright.bold('[Title]')}: ${chalk.whiteBright(result.title)}`);
          log(`${chalk.yellowBright.bold('[Text]')}: ${chalk.whiteBright(result.text)}`);
          log(`${chalk.whiteBright.bold('[Link]')}: ${chalk.cyanBright(result.href)}`);
          log('');
        }
      });

      if (options.stats) {
        const totalLinks = results.stats.total;
        log(`${chalk.bold('[Total links]')}: ${chalk.whiteBright(totalLinks)}`);
        if (options.validate) {
          log(`${chalk.greenBright.bold('[Valid links]')}: ${chalk.whiteBright(validLinks)}`);
          log(`${chalk.redBright.bold('[Invalid links]')}: ${chalk.whiteBright(invalidLinks)}`);
        }
      }
    }
  })
  .catch((error) => {
    console.error(`Error: ${error.message}`);
  });
