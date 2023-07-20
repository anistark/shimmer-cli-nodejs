import pkg from '@iota/sdk';
const { AddressUnlockCondition,
    Ed25519Address,
    IssuerFeature,
    MintNftParams,
    SenderFeature,
    utf8ToHex,
    Utils,
    Wallet,
    SendNftParams
} = pkg;

import 'dotenv/config';

const NFT1_METADATA = utf8ToHex('some NFT metadata');
const NFT1_IMMUTABLE_METADATA = utf8ToHex('some NFT immutable metadata');
const NFT1_TAG = utf8ToHex('some NFT tag');

export async function mintNFT(alias) {
    try {
        if (!process.env.STRONGHOLD_PASSWORD) {
            throw new Error(
                '.env STRONGHOLD_PASSWORD is undefined, see .env.example',
            );
        }

        const wallet = new Wallet({
            storagePath: process.env.WALLET_DB_PATH,
        });

        const account = await wallet.getAccount(alias);

        await wallet.setStrongholdPassword(process.env.STRONGHOLD_PASSWORD);

        // We send from the first address in the account.
        const senderAddress = (await account.addresses())[0].address;

        const params = {
            sender: senderAddress,
            metadata: NFT1_METADATA,
            tag: NFT1_TAG,
            issuer: senderAddress,
            immutableMetadata: NFT1_IMMUTABLE_METADATA,
        };
        const prepared = await account.prepareMintNfts([params]);

        let transaction = await prepared.send();
        console.log(`Transaction sent: ${transaction.transactionId}`);

        // Wait for transaction to get included
        let blockId = await account.retryTransactionUntilIncluded(
            transaction.transactionId,
        );

        console.log(
            `Block included: ${process.env.EXPLORER_URL}/block/${blockId}`,
        );
        console.log('Minted NFT');

        // Ensure the account is synced after minting.
        await account.sync();
    } catch (error) {
        console.error('Error: ', error.error);
    }
}

export async function sendNFT(alias, receiver) {
    try {
        if (!process.env.STRONGHOLD_PASSWORD) {
            throw new Error(
                '.env STRONGHOLD_PASSWORD is undefined, see .env.example',
            );
        }

        const wallet = new Wallet({
            storagePath: process.env.WALLET_DB_PATH,
        });

        // Get the account we generated with `01-create-wallet`
        const account = await wallet.getAccount(alias);

        await wallet.setStrongholdPassword(process.env.STRONGHOLD_PASSWORD);

        // May want to ensure the account is synced before sending a transaction.
        const balance = await account.sync();

        if (balance.nfts.length == 0) {
            throw new Error('No available NFTs');
        }

        const nftId = balance.nfts[0];

        const outputs = [
            {
                address: receiver,
                nftId,
            },
        ];

        // Send the full NFT output to the specified address
        const transaction = await account
            .prepareSendNft(outputs)
            .then((prepared) => prepared.send());

        console.log(`Transaction sent: ${transaction.transactionId}`);

        // Wait for transaction to get included
        const blockId = await account.retryTransactionUntilIncluded(
            transaction.transactionId,
        );

        console.log(
            `Block included: ${process.env.EXPLORER_URL}/block/${blockId}`,
        );
    } catch (error) {
        console.log('Error: ', error);
    }
    process.exit(0);
}
