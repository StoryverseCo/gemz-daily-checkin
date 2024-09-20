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
        {
            $$type: 'Transfer',
            amount: toNano('0.04'),
        },
    );

    ui.write('Done!');
}
