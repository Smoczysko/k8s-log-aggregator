#!/usr/bin/env node

const program = require('commander');
const chalk = require('chalk');
const path = require('path');

const watchCommand = require('./commands/watch');
const downloadCommand = require('./commands/download');

const pkg = require(path.join(__dirname, '../package.json'));

(async () => {
    program
        .version(pkg.version)
        .description(pkg.description);

    program.on('command:*', () => {
        console.error(chalk.red('Invalid command - please check help for assistance.'));

        process.exit(1);
    });

    if (!process.argv.slice(2).length) {
        console.error(chalk.red('No command specified - please check help for assistance.'));

        process.exit(1);
    }

    program
        .command('watch')
        .alias('w')
        .description('Allows to watch logs from multiple pods (that share name prefix( with same container within')
        .arguments('<prefix> <container>')
        .action(watchCommand);

    program
        .command('download')
        .alias('d')
        .description('Allows to download logs from multiple pods (that share name prefix) with same container within')
        .arguments('<prefix> <container> <file>')
        .action(downloadCommand);

    await program.parseAsync();
})();


