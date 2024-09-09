import { CompilerConfig } from '@ton/blueprint';

export const compile: CompilerConfig = {
    lang: 'tact',
    target: 'contracts/gemz_daily_checkin.tact',
    options: {
        debug: true,
    },
};
