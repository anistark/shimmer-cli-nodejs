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
import {
    send
} from '../commands/transactions.js';
import {
    mintNFT,
    sendNFT
} from '../commands/nft.js';
import {
    newToken,
    mintToken,
    sendToken
} from '../commands/token.js';
import {
    requestAddress,
    requestToken
} from '../commands/request.js';
import {
    aiPrompt
} from '../commands/ai.js';

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

program
    .command('send')
    .argument('<alias>', 'Alias of your Wallet Account')
    .argument('<address>', 'Receiver Address')
    .argument('<amount>', 'Amount')
    .description('Send SMR to an address.')
    .action(send);

program
    .command('ai')
    .description('Enter Shimmer AI ✨')
    .action(aiPrompt);

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

const token = program.command('token');

token
    .command('new')
    .argument('<alias>', 'Alias of your Wallet Account')
    .description('Create new Native Token.')
    .action(newToken);

token
    .command('mint')
    .argument('<alias>', 'Alias of your Wallet Account')
    .argument('<foundry>', 'Foundry ID of the Naitve Token')
    .argument('<amount>', 'Amount of tokens to mint')
    .description('Mint new Native Tokens.')
    .action(mintToken);

token
    .command('send')
    .argument('<alias>', 'Alias of your Wallet Account')
    .argument('<foundry>', 'Foundry ID of the Naitve Token')
    .argument('<amount>', 'Amount of tokens to mint')
    .argument('<receiver>', 'Send to this address')
    .description('Send Native Tokens to an address.')
    .action(sendToken);

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

const request = program.command('request');

request
    .command('address')
    .option('--token', 'Token requesting deposit for')
    .description('Request an address to send deposit to.')
    .action(requestAddress);

request
    .command('token')
    .argument('<alias>', 'Alias of your Wallet Account')
    .argument('<address>', 'Address to Send SMR to.')
    .argument('<amount>', 'Alias of your Wallet Account')
    .argument('<foundry>', 'Foundry ID of the token')
    .description('Request token in exchange for SMR sent.')
    .action(requestToken);

program.parse();
