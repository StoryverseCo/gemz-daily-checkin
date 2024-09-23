import "@stdlib/deploy";

message Withdraw {
    amount: Int as coins;
}


contract GemzDailyCheckin with Deployable {
    id: Int as uint32;
    owner: Address;
    const MinTonForStorage: Int = ton("0.01");
    counter: Int;

    init(id: Int) {
        self.id = id;
        self.owner = sender();
        self.counter = 0;
    }

    receive("Gemz Checkin") {

        let sender: Address = sender();
        let tonCoins: Int = context().value;

        if (tonCoins <= 0) {
            throw(100);  // No funds sent in the transaction
        }

        self.counter += 1;

        // Notify the caller that the receiver was executed and forward remaining value back
        self.notify("Cashback".asComment());
    }

    receive(msg: Withdraw) {
        require(sender() == self.owner, "Only deployer is allowed to withdraw");
        let amount: Int = min(msg.amount, myBalance() - context().value - self.MinTonForStorage);
        require(amount > 0, "Insufficient balance");
        send(SendParameters{
            to: sender(),
            bounce: true,
            value: amount,
            mode: SendRemainingValue + SendIgnoreErrors
        });
    }

    get fun balance(): Int {
        return myBalance();
    }

    get fun id(): Int {
        return self.id;
    }

    get fun counter(): Int {
        return self.counter;
    }
}
