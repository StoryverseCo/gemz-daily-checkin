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
    const counterAddress = Address.parse("EQBj4jX-6KSEY5oFd98sdIZB5YrnOWIOvskD_Mf8VuJ4EAeB");
    if (!(await provider.isContractDeployed(counterAddress))) {
        ui.write(`Error: Contract at address ${counterAddress} is not deployed!`);
        return;
    }

    const counter = provider.open(GemzDailyCheckin.fromAddress(counterAddress));
    const counterContract = client.open(counter);

    // call the getter on chain
    const counterValue = await counterContract.getCounter();
    console.log("Counter value:", counterValue.toString());

    const senderAddress = provider.sender().address;
    console.log('Sender address:', senderAddress);
    if(!senderAddress) {
        throw new Error('Sender address is not found');
    }

    const dailyCheckins = await counterContract.getAllCheckins();
    console.log('Daily checkins:', dailyCheckins);

    const queryId = await counterContract.getId();
    console.log('Query ID:', queryId);

    // @ts-ignore
    // const dailyCheckin = await counterContract.getLastCheckin(`a:${senderAddress}`);
    // console.log('Daily checkin:', dailyCheckin);
}
