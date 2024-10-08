import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { GemzDailyCheckin } from '../wrappers/GemzDailyCheckin';
import '@ton/test-utils';

describe('GemzDailyCheckin', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let gemzDailyCheckin: SandboxContract<GemzDailyCheckin>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        deployer = await blockchain.treasury('deployer');

        gemzDailyCheckin = blockchain.openContract(await GemzDailyCheckin.fromInit( 0n));

        const deployResult = await gemzDailyCheckin.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: gemzDailyCheckin.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and gemzDailyCheckin are ready to use
    });

    it('should increase counter', async () => {
        const increaseTimes = 3;
        for (let i = 0; i < increaseTimes; i++) {
            console.log(`increase ${i + 1}/${increaseTimes}`);

            const increaser = await blockchain.treasury('increaser' + i);

            const counterBefore = await gemzDailyCheckin.getCounter(increaser.address);

            console.log('counter before increasing', counterBefore);

            const increaseBy = 1n;

            console.log('increasing by', increaseBy);

            const increaseResult = await gemzDailyCheckin.send(
                increaser.getSender(),
                {
                    value: toNano('0.05'),
                },
                'Gemz Checkin',            );

            expect(increaseResult.transactions).toHaveTransaction({
                from: increaser.address,
                to: gemzDailyCheckin.address,
                success: true,
            });

            const counterAfter = await gemzDailyCheckin.getCounter(increaser.address);

            console.log('counter after increasing', counterAfter);

            const lastCheckin = await gemzDailyCheckin.getLastCheckin(increaser.getSender().address);

            console.log(`last checkin from ${increaser.getSender().address}`, lastCheckin);

            console.log('checkins', await gemzDailyCheckin.getAllCheckins());

            expect(counterAfter).toBe(counterBefore + increaseBy);
            expect(lastCheckin).toBeTruthy();
        }
    });

    it('should not increase counter the second time', async () => {
        let increaser = await blockchain.treasury('increaser');
        const counterBefore = await gemzDailyCheckin.getCounter(increaser.address);
        console.log('counter before increasing', counterBefore);

        const increaseBy = 1n;
        console.log('increasing by', increaseBy);

        const increaseResult = await gemzDailyCheckin.send(
            increaser.getSender(),
            {
                value: toNano('0.05'),
            },
            'Gemz Checkin',
        );

        expect(increaseResult.transactions).toHaveTransaction({
            from: increaser.address,
            to: gemzDailyCheckin.address,
            success: true,
        });

        const counterAfter = await gemzDailyCheckin.getCounter(increaser.address);
        console.log('counter after increasing', counterAfter);

        const lastCheckin = await gemzDailyCheckin.getLastCheckin(increaser.getSender().address);
        console.log(`last checkin from ${increaser.getSender().address}`, lastCheckin);

        expect(counterAfter).toBe(counterBefore + increaseBy);

        const increaseResult2 = await gemzDailyCheckin.send(
            increaser.getSender(),
            {
                value: toNano('0.05'),
            },
            'Gemz Checkin',
        );

        const counterAfter2 = await gemzDailyCheckin.getCounter(increaser.address);
        const lastCheckin2 = await gemzDailyCheckin.getLastCheckin(increaser.getSender().address);
        expect(counterAfter2).toBe(counterAfter);
        expect(lastCheckin2.timestamp).toBe(lastCheckin.timestamp);
        console.log('checkins', await gemzDailyCheckin.getAllCheckins());

    });

    it('should not show balance', async () => {
        const balanceBefore = await gemzDailyCheckin.getBalance();
        console.log('Balance before', balanceBefore);

        let increaseTimes = 10;
        for (let i = 0; i < increaseTimes; i++) {
            let increaser = await blockchain.treasury(`increaser + ${i}`);

            await gemzDailyCheckin.send(
                increaser.getSender(),
                {
                    value: toNano('0.05'),
                },
                'Gemz Checkin',
            );
        }


        const balanceAfter = await gemzDailyCheckin.getBalance();
        expect(balanceAfter).toBeGreaterThan(balanceBefore);

        // transfer to deployer
        await gemzDailyCheckin.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Withdraw',
                amount: balanceAfter - 9000000n,
            }
        )

        const balanceAfterTransfer = await gemzDailyCheckin.getBalance();
        console.log('balance after transfer', balanceAfterTransfer);
        expect(balanceAfterTransfer).toEqual(toNano("0.01"));
    })
});
