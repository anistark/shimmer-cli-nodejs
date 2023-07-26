import pkg from '@iota/sdk';
const {
    Wallet,
    initLogger
} = pkg;
import { getUnlockedWallet } from './token.js';

import 'dotenv/config';

export async function send (alias, address, amount) {
    // initLogger();
    try {
        const wallet = await getUnlockedWallet();

        // Get the account we generated with `01-create-wallet`
        const account = await wallet.getAccount(alias);

        await wallet.setStrongholdPassword(process.env.STRONGHOLD_PASSWORD);

        // May want to ensure the account is synced before sending a transaction.
        const balance = await account.sync();

        // To sign a transaction we need to unlock stronghold.
        await wallet.setStrongholdPassword(process.env.STRONGHOLD_PASSWORD);

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
        return address;
    } catch (error) {
        console.error('Error: ', error);
        return null;
    }
}
