import { Client, initLogger } from '@iota/sdk';

export async function info () {
    initLogger();

    const client = new Client({
        nodes: ['https://api.testnet.shimmer.network'],
        localPow: true,
    });

    try {
        const nodeInfo = await client.getInfo();
        console.log('Node info: ', nodeInfo);
    } catch (error) {
        console.error('Error: ', error);
    }
    return;
}
