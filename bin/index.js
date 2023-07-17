#! /usr/bin/env node
import { program } from 'commander';
import { printBox } from '../utils/log.js';
import { VERSION } from '../config/config.js';
import chalk from 'chalk';

program
    .name('shimmy')
    .description('CLI to Shimmer Network. v' + VERSION)
    .version(VERSION)
    .addHelpText('beforeAll', printBox(chalk.white.bold("v" + VERSION),'Shimmy CLI'))
    .showHelpAfterError('(add --help for additional information)');

program.parse();
