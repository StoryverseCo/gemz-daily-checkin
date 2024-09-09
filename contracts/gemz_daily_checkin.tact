import "@stdlib/deploy";

message Add {
    queryId: Int as uint64;
    amount: Int as uint32;
}

contract GemzDailyCheckin with Deployable {
    id: Int as uint32;
    counter: Int as uint32;
    // Declare the dictionary to store user data
    user_data: map<Address, Int>;

    init(id: Int) {
        self.id = id;
        self.counter = 0;
    }

    receive(msg: Add) {
        let sender: Address = sender();
        let tonCoins: Int = context().value;

        if (tonCoins <= 0) {
            throw(100);  // No funds sent in the transaction
        }

        // Get current timestamp
        let current_time: Int = now();

        // Get user's last check-in time from the dictionary
        let last_checkin: Int = 0;
        if (self.user_data.get(sender) != null) {
            last_checkin = self.user_data.get(sender)!!;
        }

        // Check if the user can perform a daily check-in (24-hour limit)
        if (current_time - last_checkin < 86400) {
            throw(101);  // Daily check-in already performed
        }


        self.counter += msg.amount;
        // Update last check-in time in the user_data dictionary
        self.user_data.set(sender, current_time);

        // Notify the caller that the receiver was executed and forward remaining value back
        self.notify("Cashback".asComment());
    }

    get fun counter(): Int {
        return self.counter;
    }

    get fun id(): Int {
        return self.id;
    }

    // Method to query the last check-in time of a user by public key
    get fun last_checkin(sender: Address): Int {
        if (self.user_data.get(sender) != null) {
            return self.user_data.get(sender)!!;
        }
        return 0;  // User not found
    }
}
