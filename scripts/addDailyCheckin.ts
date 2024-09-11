import { Address, toNano } from '@ton/core';
import { GemzDailyCheckin } from '../wrappers/GemzDailyCheckin';
import { NetworkProvider, sleep } from '@ton/blueprint';

export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();

    const contractAddress = Address.parse('EQBj4jX-6KSEY5oFd98sdIZB5YrnOWIOvskD_Mf8VuJ4EAeB');

    if (!(await provider.isContractDeployed(contractAddress))) {
        ui.write(`Error: Contract at address ${contractAddress} is not deployed!`);
        return;
    }

    const gemzDailyCheckin = provider.open(GemzDailyCheckin.fromAddress(contractAddress));

    const counterBefore = await gemzDailyCheckin.getCounter();

    const resp = await gemzDailyCheckin.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Add',
            queryId: 0n,
            amount: 1n,
        }
    );

    console.log('Response:', resp);

    ui.write('Waiting for counter to increase...');

    // let counterAfter = await gemzDailyCheckin.getCounter();
    // let attempt = 1;
    // while (counterAfter === counterBefore) {
    //     ui.setActionPrompt(`Attempt ${attempt}`);
    //     await sleep(2000);
    //     counterAfter = await gemzDailyCheckin.getCounter();
    //     attempt++;
    // }

    ui.clearActionPrompt();
    ui.write('Counter increased successfully!');
}
