import { getHttpEndpoint } from "@orbs-network/ton-access";
import { TonClient, Address } from "@ton/ton";
import { GemzDailyCheckin } from '../wrappers/GemzDailyCheckin';
import { NetworkProvider } from '@ton/blueprint';

// process.env.WALLET_MNEMONIC = 'extend bread grid idle mansion want obscure lyrics donkey bitter swear sauce wealth marine bind beef blast vehicle ramp canyon earn renew menu jaguar';
process.env.WALLET_MNEMONIC = 'shed finger august weekend lesson cover coyote clock appear census chest offer casino medal grain oval hire above venue diary clever civil gift party';
process.env.WALLET_VERSION = 'V4';

export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();
    // initialize ton rpc client on mainnet
    const endpoint = await getHttpEndpoint();
    const client = new TonClient({ endpoint });

    // open Counter instance by address
    const counterAddress = Address.parse('EQCYrdes6RgbOEaDmJDQR1grbcmbr-2FqSGcKHiMrNPP5m4w');
    if (!(await provider.isContractDeployed(counterAddress))) {
        ui.write(`Error: Contract at address ${counterAddress} is not deployed!`);
        return;
    }

    const counter = provider.open(GemzDailyCheckin.fromAddress(counterAddress));
    const counterContract = client.open(counter);

    const sender = provider.sender().address;
    console.log('Sender address:', sender);
    if(!sender) {
        throw new Error('Sender address is not found');
    }

    // call the getter on chain
    // const counterValue = await counterContract.getCounter(sender);
    // console.log("Counter value:", counterValue.toString());

    const dailyCheckins = await counterContract.getAllCheckins();
    console.log('Daily checkins:', dailyCheckins);

    const queryId = await counterContract.getId();
    console.log('Query ID:', queryId);

    // @ts-ignore
    // const dailyCheckin = await counterContract.getLastCheckin(`a:${sender}`);
    // console.log('Daily checkin:', dailyCheckin);
}
