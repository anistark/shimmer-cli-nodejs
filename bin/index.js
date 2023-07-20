#! /usr/bin/env node
import { program } from 'commander';
import { printBox } from '../utils/log.js';
import { VERSION } from '../config/config.js';
import chalk from 'chalk';
import { info } from '../commands/node.js';
import {
    newAccount,
    listAccounts,
    listAddresses,
    newAddress,
    getBalance
} from '../commands/account.js';
// import {
//     newToken
// } from '../commands/token.js';
import {
    mintNFT,
    sendNFT
} from '../commands/nft.js';

program
    .name('shimy')
    .description('CLI to Shimmer Network. v' + VERSION)
    .version(VERSION)
    // .addHelpText('beforeAll', printBox(chalk.white.bold("v" + VERSION),'Shimy CLI'))
    .showHelpAfterError('(add --help for additional information)');

program
    .command('info')
    .description('Info about this node.')
    .action(info);

const account = program.command('account');

account
    .command('new')
    .argument('<alias>', 'Alias of your Wallet Account')
    .description('Generate a new account.')
    .action(newAccount);

account
    .command('balance')
    .argument('<alias>', 'Alias of your Wallet Account')
    .description('Balance of account.')
    .action(getBalance);

account
    .command('list')
    .description('List all accounts.')
    .action(listAccounts);

const address = program.command('address');

address
    .command('list')
    .argument('<alias>', 'Alias of your Wallet Account')
    .description('List all addresses.')
    .action(listAddresses);

address
    .command('new')
    .argument('<alias>', 'Alias of your Wallet Account')
    .description('Create new address.')
    .action(newAddress);

// const token = program.command('token');

// token
//     .command('new')
//     // .argument('<alias>', 'Alias of your Wallet Account')
//     .description('Create new Native Token.')
//     .action(newToken);

const nft = program.command('nft');

nft
    .command('mint')
    .argument('<alias>', 'Alias of your Wallet Account')
    .description('Mint new NFT.')
    .action(mintNFT);

nft
    .command('send')
    .argument('<alias>', 'Alias of your Wallet Account')
    .argument('<receiver>', 'Receiver Address to Send NFT to.')
    .description('Send NFT')
    .action(sendNFT);

program.parse();
