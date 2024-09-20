import "@stdlib/deploy";

struct Checkin {
    timestamp: Int;
    counter: Int;
}

message Withdraw {
    amount: Int as coins;
}


contract GemzDailyCheckin with Deployable {
    id: Int as uint32;
    owner: Address;
    // Declare the dictionary to store user data
    user_data: map<Address, Checkin>;
    const MinTonForStorage: Int = ton("0.01");

    init(id: Int) {
        self.id = id;
        self.owner = sender();
    }

    receive("Gemz Checkin") {

        let sender: Address = sender();
        let tonCoins: Int = context().value;

        if (tonCoins <= 0) {
            throw(100);  // No funds sent in the transaction
        }

        // Get current timestamp
        let current_time: Int = now();

        // Get user's last check-in time from the dictionary
        let last_checkin: Checkin = Checkin{timestamp: 0, counter: 0};
        if (self.user_data.get(sender) != null) {
            last_checkin = self.user_data.get(sender)!!;
        }

        // Check if the user can perform a daily check-in (24-hour limit)
        if (current_time - last_checkin.timestamp < 86400) {
            throw(101);  // Daily check-in already performed
        }

        // Update last check-in time in the user_data dictionary
        self.user_data.set(sender, Checkin{timestamp: current_time, counter: last_checkin.counter + 1});

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

    get fun counter(sender: Address): Int {
        if (self.user_data.get(sender) != null) {
            let checkin = self.user_data.get(sender)!!;
            return checkin.counter;
        }
        return 0;  // User not found
    }

    get fun id(): Int {
        return self.id;
    }

    // Method to query the last check-in time of a user by public key
    get fun last_checkin(sender: Address): Checkin {
        if (self.user_data.get(sender) != null) {
            return self.user_data.get(sender)!!;
        }
        return Checkin{timestamp: 0, counter: 0};  // User not found
    }

    get fun all_checkins(): map<Address, Checkin> {
        return self.user_data;
    }
}
