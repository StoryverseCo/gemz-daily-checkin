import { Address, toNano } from '@ton/core';
import { GemzDailyCheckin } from '../wrappers/GemzDailyCheckin';
import { NetworkProvider, sleep } from '@ton/blueprint';

export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();

    const contractAddress = Address.parse('EQC_0ScHnb7bVoyInXLkZ2G4XRHg97S9XrPKCUDaO1ZRyFhZ');

    if (!(await provider.isContractDeployed(contractAddress))) {
        ui.write(`Error: Contract at address ${contractAddress} is not deployed!`);
        return;
    }

    const gemzDailyCheckin = provider.open(GemzDailyCheckin.fromAddress(contractAddress));


    const resp = await gemzDailyCheckin.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        'Gemz Checkin',
    );

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
