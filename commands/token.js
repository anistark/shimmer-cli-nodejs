import pkg from '@iota/sdk';
const { AddressUnlockCondition,
    CreateNativeTokenParams,
    utf8ToHex,
    initLogger,
    Wallet,
    CoinType,
    WalletOptions
} = pkg;

import 'dotenv/config';

// The circulating supply of the native token.
const CIRCULATING_SUPPLY = BigInt(100);
// The maximum supply of the native token.
const MAXIMUM_SUPPLY = BigInt(100);

export async function newToken(alias) {
    try {
        // Create the wallet
        const wallet = await getUnlockedWallet();

        // Get the account we generated with `01-create-wallet`
        const account = await wallet.getAccount(alias);

        const balance = await account.sync();

        // We can first check if we already have an alias in our account, because an alias can have
        // many foundry outputs and therefore we can reuse an existing one
        if (balance.aliases.length == 0) {
            // If we don't have an alias, we need to create one
            const transaction = await account
                .prepareCreateAliasOutput()
                .then((prepared) => prepared.send());
            console.log(`Transaction sent: ${transaction.transactionId}`);

            // Wait for transaction to get included
            const blockId = await account.retryTransactionUntilIncluded(
                transaction.transactionId,
            );

            console.log(
                `Block included: ${process.env.EXPLORER_URL}/block/${blockId}`,
            );

            await account.sync();
            console.log('Account synced');
        }

        console.log('Preparing transaction to create native token...');

        // If we omit the AccountAddress field the first address of the account is used by default
        const params = {
            circulatingSupply: CIRCULATING_SUPPLY,
            maximumSupply: MAXIMUM_SUPPLY,
            foundryMetadata: utf8ToHex('Test 1!'),
        };

        const prepared = await account.prepareCreateNativeToken(params);
        const transaction = await prepared.send();

        console.log(`Transaction sent: ${transaction.transactionId}`);

        // Wait for transaction to get included
        const blockId = await account.retryTransactionUntilIncluded(
            transaction.transactionId,
        );

        console.log(
            `Block included: ${process.env.EXPLORER_URL}/block/${blockId}`,
        );

        console.log(`\nCreated token!\nFoundry ID: ${prepared.tokenId()}`);

        // Ensure the account is synced after creating the native token.
        await account.sync();
        console.log('Account synced');
    } catch (error) {
        console.error('Error: ', error.error);
    }
}

export async function getUnlockedWallet() {
    initLogger();
    if (!process.env.NODE_URL) {
        throw new Error('.env NODE_URL is undefined, see .env.example');
    }
    if (!process.env.STRONGHOLD_PASSWORD) {
        throw new Error(
            '.env STRONGHOLD_PASSWORD is undefined, see .env.example',
        );
    }
    if (!process.env.STRONGHOLD_SNAPSHOT_PATH) {
        throw new Error(
            '.env STRONGHOLD_SNAPSHOT_PATH is undefined, see .env.example',
        );
    }
    if (!process.env.MNEMONIC) {
        throw new Error('.env MNEMONIC is undefined, see .env.example');
    }
    if (!process.env.WALLET_DB_PATH) {
        throw new Error('.env WALLET_DB_PATH is undefined, see .env.example');
    }

    const walletOptions = {
        storagePath: process.env.WALLET_DB_PATH,
        clientOptions: {
            nodes: [process.env.NODE_URL],
        },
        coinType: CoinType.Shimmer,
        secretManager: {
            stronghold: {
                snapshotPath: process.env.STRONGHOLD_SNAPSHOT_PATH,
                password: process.env.STRONGHOLD_PASSWORD,
            },
        },
    };
    const wallet = new Wallet(walletOptions);

    return wallet;
}

export async function mintToken(alias, foundry, amount) {
    try {
        const parsedAmount = BigInt(amount);
        // Create the wallet
        const wallet = await getUnlockedWallet();

        // Get the account we generated with `01-create-wallet`
        const account = await wallet.getAccount(alias);

        // May want to ensure the account is synced before sending a transaction.
        let balance = await account.sync();

        if (balance.foundries.length == 0) {
            throw new Error(`No Foundry available in account 'Alice'`);
        }

        let token = balance.nativeTokens.find(
            (nativeToken) => nativeToken.tokenId == foundry,
        );
        if (token == null) {
            throw new Error(
                `Couldn't find native token '${tokenId}' in the account`,
            );
        }
        console.log(`Balance before minting: ${token.available}`);

        // Mint some more native tokens
        const transaction = await account
            .prepareMintNativeToken(token.tokenId, parsedAmount)
            .then((prepared) => prepared.send());

        console.log(`Transaction sent: ${transaction.transactionId}`);

        // Wait for transaction to get included
        const blockId = await account.retryTransactionUntilIncluded(
            transaction.transactionId,
        );

        console.log(
            `Block included: ${process.env.EXPLORER_URL}/block/${blockId}`,
        );

        balance = await account.sync();
        token = balance.nativeTokens.find(
            (nativeToken) => nativeToken.tokenId == tokenId,
        );
        if (token == null) {
            throw new Error(
                `Couldn't find native token '${tokenId}' in the account`,
            );
        }
        console.log(`Balance after minting: ${token.available}`);
    } catch (error) {
        console.log('Error: ', error);
    }
}

export async function sendToken(alias, foundry, amount, receiver) {
    try {
        // Create the wallet
        const wallet = await getUnlockedWallet();

        // Get the account we generated with `01-create-wallet`
        const account = await wallet.getAccount(alias);

        // May want to ensure the account is synced before sending a transaction.
        let balance = await account.sync();

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

        const transaction = await account
            .prepareSendNativeTokens(outputs)
            .then((prepared) => prepared.send());

        console.log(`Transaction sent: ${transaction.transactionId}`);

        // Wait for transaction to get included
        const blockId = await account.retryTransactionUntilIncluded(
            transaction.transactionId,
        );

        console.log(
            `Block included: ${process.env.EXPLORER_URL}/block/${blockId}`,
        );

        balance = await account.sync();
        token = balance.nativeTokens.find(
            (nativeToken) => nativeToken.tokenId == foundry,
        );
        if (token == null) {
            throw new Error(
                `Couldn't find native token '${foundry}' in the account`,
            );
        }
        console.log(`Balance after sending: ${token.available}`);
    } catch (error) {
        console.log('Error: ', error);
    }
}
