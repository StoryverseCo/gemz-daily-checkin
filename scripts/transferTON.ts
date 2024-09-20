import { Address, toNano } from '@ton/core';
import { GemzDailyCheckin } from '../wrappers/GemzDailyCheckin';
import { NetworkProvider, sleep } from '@ton/blueprint';

export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();

    const contractAddress = Address.parse('EQCPoRo17IT_-KUngSrPl3xYdsm_bcF2ttCDy1Zg-86yw47t');

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
            $$type: 'Withdraw',
            amount: toNano('0.05'),
        },
    );

    ui.write('Done!');
}
