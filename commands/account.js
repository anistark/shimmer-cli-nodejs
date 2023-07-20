import pkg from '@iota/sdk';
const { Wallet, CoinType, initLogger, WalletOptions } = pkg;

import 'dotenv/config';

export async function newAccount (alias) {
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
    try {
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

        // A mnemonic can be generated with `Utils.generateMnemonic()`.
        // Store the mnemonic in the Stronghold snapshot, this needs to be done only the first time.
        // The mnemonic can't be retrieved from the Stronghold file, so make a backup in a secure place!
        await wallet.storeMnemonic(process.env.MNEMONIC);

        // Create a new account
        const account = await wallet.createAccount({
            alias: alias,
        });
        console.log('Generated new account:', account.getMetadata().alias);
    } catch (error) {
        console.error('Error: ', error);
    }
}

export async function listAccounts() {
    initLogger();
    if (!process.env.WALLET_DB_PATH) {
        throw new Error('.env WALLET_DB_PATH is undefined, see .env.example');
    }
    try {
        const wallet = new Wallet({
            storagePath: process.env.WALLET_DB_PATH,
        });

        const accounts = await wallet.getAccounts();

        for (const account of accounts)
            console.log('Alias:', account.getMetadata().alias);
    } catch (error) {
        console.error('Error: ', error);
    }
}

export async function newAddress(alias) {
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

        const address = (await account.generateEd25519Addresses(1))[0];

        console.log(`Generated address:`, address.address);
    } catch (error) {
        console.error('Error: ', error);
    }
}

export async function listAddresses(alias) {
    initLogger();
    if (!process.env.WALLET_DB_PATH) {
        throw new Error('.env WALLET_DB_PATH is undefined, see .env.example');
    }
    try {
        const wallet = new Wallet({
            storagePath: process.env.WALLET_DB_PATH,
        });

        const account = await wallet.getAccount(alias);

        const addresses = await account.addresses();

        let a = 0;
        for (const address of addresses) {
            console.log(a, '::' , address.address);
            a++;
        };
    } catch (error) {
        console.error('Error: ', error);
    }
}

export async function getBalance(alias) {
    initLogger();
    if (!process.env.WALLET_DB_PATH) {
        throw new Error('.env WALLET_DB_PATH is undefined, see .env.example');
    }
    try {
        const wallet = new Wallet({
            storagePath: process.env.WALLET_DB_PATH,
        });

        const account = await wallet.getAccount(alias);

        // Sync new outputs from the node.
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _syncBalance = await account.sync();

        // After syncing the balance can also be computed with the local data
        const balance = await account.getBalance();
        console.log('Balance', balance);
    } catch (error) {
        console.error('Error: ', error);
    }
}
