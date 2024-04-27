import User from '../models/user.model.js';

export const addFriend = async (req, res) => {
    try {
        const loggedInUserId = req.user._id; // Assuming req.user is set from a session or JWT
        const { friendId } = req.params;// The ID of the user to be added as a friend
        // console.log(loggedInUserId.toString()," ",friendId);
          if (loggedInUserId.toString() === friendId) {
            return res.status(400).send({ error: 'You cannot add yourself as a friend.' });
        }
        // Check if the friendId is already in the user's friends list
        const user = await User.findById( loggedInUserId );
        // console.log(user);
        if (user.friends.includes(friendId)) {
            return res.status(409).send({ error: 'This user is already your friend.' });
        }
        // Check if the friend exists
        const friendExists = await User.findById( friendId );
        // console.log(friendExists);
        if (!friendExists) {
            return res.status(404).send({ error: 'Friend not found.' });
        }

        // Add the friend
        friendExists.friends.push( loggedInUserId );
        await friendExists.save();
        user.friends.push(friendId);
        await user.save();

        res.status(200).send({ message: 'Friend added successfully.', user });
    } catch (error) {
        console.error("Error in addFriend: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};