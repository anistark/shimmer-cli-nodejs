import pkg from '@iota/sdk';
const { Wallet, CoinType, initLogger, WalletOptions } = pkg;
import {
    newAddress
} from './account.js';
import {
    send
} from './transactions.js';
import {
    sendToken
} from './token.js';

import 'dotenv/config';

export async function requestAddress(options) {
    console.log('options:', options);
    // Create a new address and send back
    let address = await newAddress('Brian');
    return address;
}

export async function requestToken(alias, address, amount, foundry) {
    // let address = await newAddress('Brian');
    initLogger();
    if (!process.env.WALLET_DB_PATH) {
        throw new Error('.env WALLET_DB_PATH is undefined, see .env.example');
    }
    if (!process.env.STRONGHOLD_PASSWORD) {
        throw new Error(
            '.env STRONGHOLD_PASSWORD is undefined, see .env.example',
        );
    }
    try {
        const wallet = new Wallet({
            storagePath: process.env.WALLET_DB_PATH,
        });

        const account = await wallet.getAccount(alias);

        // To create an address we need to unlock stronghold.
        await wallet.setStrongholdPassword(process.env.STRONGHOLD_PASSWORD);

        const balance = await account.sync();

        console.log('Sending', amount, 'to', address);
        const parsedAmount = BigInt(amount);

        const transaction = await account.send(parsedAmount, address, {
            allowMicroAmount: true,
        });

        console.log(`Transaction sent: ${transaction.transactionId}`);

        const blockId = await account.retryTransactionUntilIncluded(
            transaction.transactionId,
        );

        console.log(`Block sent: ${process.env.EXPLORER_URL}/block/${blockId}`);
        // await sendToken(alias, foundry, amount, sentTo);
        const outputs = [
            {
                address: receiver,
                nativeTokens: [[foundry, amount]],
            },
        ];

        let token = balance.nativeTokens.find(
            (nativeToken) => nativeToken.tokenId == foundry,
        );
        if (token == null) {
            throw new Error(
                `Couldn't find native token '${foundry}' in the account`,
            );
        }
        console.log(`Balance before sending: ${token.available}`);

        const transaction2 = await account
            .prepareSendNativeTokens(outputs)
            .then((prepared) => prepared.send());

        console.log(`Transaction sent: ${transaction2.transactionId}`);

        // Wait for transaction to get included
        const blockId2 = await account.retryTransactionUntilIncluded(
            transaction2.transactionId,
        );

        console.log(
            `Block included: ${process.env.EXPLORER_URL}/block/${blockId2}`,
        );
    } catch (error) {
        console.error('Error: ', error);
    }
}

export async function requestSmr(alias, address, amount, foundry) {
    // let address = await newAddress('Brian');
    initLogger();
    if (!process.env.WALLET_DB_PATH) {
        throw new Error('.env WALLET_DB_PATH is undefined, see .env.example');
    }
    if (!process.env.STRONGHOLD_PASSWORD) {
        throw new Error(
            '.env STRONGHOLD_PASSWORD is undefined, see .env.example',
        );
    }
    try {
        const wallet = new Wallet({
            storagePath: process.env.WALLET_DB_PATH,
        });
        const account = await wallet.getAccount(alias);
        await wallet.setStrongholdPassword(process.env.STRONGHOLD_PASSWORD);

        const balance = await account.sync();

        // Send SMR
        console.log('Sending', amount, 'to', address);
        const parsedAmount = BigInt(amount);

        const transaction = await account.send(parsedAmount, address, {
            allowMicroAmount: true,
        });

        console.log(`Transaction sent: ${transaction.transactionId}`);

        const blockId = await account.retryTransactionUntilIncluded(
            transaction.transactionId,
        );

        console.log(`Block sent: ${process.env.EXPLORER_URL}/block/${blockId}`);

        // Send Native Token
        const accountAddresses = await account.addresses();
        const outputs = [
            {
                address: accountAddresses[0].address,
                nativeTokens: [[foundry, amount]],
            },
        ];

        let token = balance.nativeTokens.find(
            (nativeToken) => nativeToken.tokenId == foundry,
        );
        if (token == null) {
            throw new Error(
                `Couldn't find native token '${foundry}' in the account`,
            );
        }
        console.log(`Balance before sending: ${token.available}`);

        const transaction2 = await account
            .prepareSendNativeTokens(outputs)
            .then((prepared) => prepared.send());

        console.log(`Transaction sent: ${transaction2.transactionId}`);

        // Wait for transaction to get included
        const blockId2 = await account.retryTransactionUntilIncluded(
            transaction2.transactionId,
        );

        console.log(
            `Block included: ${process.env.EXPLORER_URL}/block/${blockId2}`,
        );

    } catch (error) {
        console.error('Error: ', error);
    }
}
