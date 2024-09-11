import { toNano } from '@ton/core';
import { GemzDailyCheckin } from '../wrappers/GemzDailyCheckin';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const gemzDailyCheckin = provider.open(await GemzDailyCheckin.fromInit(BigInt(Math.floor(Math.random() * 10000))));

    await gemzDailyCheckin.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(gemzDailyCheckin.address, 25);

    console.log('ID', await gemzDailyCheckin.getId());
}
