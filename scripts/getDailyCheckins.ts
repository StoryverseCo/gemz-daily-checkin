import { getHttpEndpoint } from "@orbs-network/ton-access";
import { TonClient, Address } from "@ton/ton";
import { GemzDailyCheckin } from '../wrappers/GemzDailyCheckin';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();
    // initialize ton rpc client on mainnet
    const endpoint = await getHttpEndpoint();
    const client = new TonClient({ endpoint });

    // open Counter instance by address
    const counterAddress = Address.parse('EQC_0ScHnb7bVoyInXLkZ2G4XRHg97S9XrPKCUDaO1ZRyFhZ');
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
