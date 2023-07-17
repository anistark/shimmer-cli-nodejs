#! /usr/bin/env node
import { program } from 'commander';
import { printBox } from '../utils/log.js';
import { VERSION } from '../config/config.js';
import chalk from 'chalk';
import { info } from '../commands/node.js';

program
    .name('shimmy')
    .description('CLI to Shimmer Network. v' + VERSION)
    .version(VERSION)
    // .addHelpText('beforeAll', printBox(chalk.white.bold("v" + VERSION),'Shimmy CLI'))
    .showHelpAfterError('(add --help for additional information)');

program
    .command('info')
    .description('Info about this node.')
    .action(info);

program.parse();
