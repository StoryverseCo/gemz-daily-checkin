import { Address, toNano } from '@ton/core';
import { GemzDailyCheckin } from '../wrappers/GemzDailyCheckin';
import { NetworkProvider, sleep } from '@ton/blueprint';

process.env.WALLET_MNEMONIC = 'extend bread grid idle mansion want obscure lyrics donkey bitter swear sauce wealth marine bind beef blast vehicle ramp canyon earn renew menu jaguar';
// process.env.WALLET_MNEMONIC = 'shed finger august weekend lesson cover coyote clock appear census chest offer casino medal grain oval hire above venue diary clever civil gift party';
process.env.WALLET_VERSION = 'V4';

export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();

    const contractAddress = Address.parse('EQCYrdes6RgbOEaDmJDQR1grbcmbr-2FqSGcKHiMrNPP5m4w');

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
        'Checkin',
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
