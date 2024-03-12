import User from "../../models/user/user.model.js";

export const searchForUsers = async (req, res) => {
    try {
        const { fullName } = req.query;
        const regex = new RegExp(fullName, "i");

        const users = await User.find({ fullName: regex });
        if (!users) {
            return res.status(400).json({
                success: false,
                message: "No Users Found"
            })
        };

        res.status(200).json({
            success: true,
            users: users
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

export const sendFriendRequest = async(req, res) => {
    try {
        const senderId = req.user.id;
        const receiverId = req.params.id;

        const recepientUser = await User.findById(receiverId);
        const sendingtUser = await User.findById(senderId);


        if(!recepientUser) {
            return res.status(404).json({success: false,
            error: "User Not Found"})
        };

        recepientUser.receivedFriendRequests.push({user: senderId})
        await recepientUser.save();
        sendingtUser.sentFriendRequests.push({user: receiverId});
        await sendingtUser.save();

        res.status(200).json({ success: true, message: 'Friend request sent successfully' });

    
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Error Sending Request' });
    }

};

export const viewReceivedFriendRequests = async (req, res) => {
    try {
        const usersId = req.user.id;
        const user = await User.findById(usersId).populate({
            path: "receivedFriendRequests.user",
            select: "fullName"
        });

        res.status(200).json({success: true, receivedRequests: user.receivedFriendRequests});

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Error Viewing Requests' });
    };
};

export const viewSentFriendRequests = async (req, res) => {
    try {
        const usersId = req.user.id;
        const user = await User.findById(usersId).populate({
            path: "sentFriendRequests.user",
            select: "fullName"
        });

        res.status(200).json({success: true, sentRequests: user.sentFriendRequests});

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Error Viewing Requests' });
    };
};

export const acceptFriendRequest = async(req, res) => {
    try {
        const userId = req.user.id;
        const senderId = req.params.id;

        await User.findByIdAndUpdate(senderId, {
            $set: {"sentFriendRequests.$[elem].status": "accepted"},
            $addToSet: {friends: userId}
        }, {arrayFilters: [{"elem.user": userId}]});

        await User.findByIdAndUpdate(userId, {
            $set: {"receivedFriendRequests.$[elem].status": "accepted"},
            $addToSet: {friends: senderId}
        }, {arrayFilters: [{"elem.user": senderId}]});

        res.status(200).json({ success: true, message: 'Friend request accepted successfully' });

        //other method 

        // const user = await User.findById(userId);
        // const sendingUser = await user.findById(senderId);

        // if(!user) {
        //     return res.status(404).json({success: false, error: "User Not Found"})
        // };

        // if(!sendingUser) {
        //     return res.status(404).json({success: false, error: "Sender Not Found"})
        // };

        // sendingUser.sendFriendRequest.forEach(request => {
        //     if(request.user.equals(userId)) {
        //         request.status = "accepted"
        //     }
        // });

        // user.receivedFriendRequests.forEach(request => {
        //     if(request.user.equals(senderId)) {
        //         request.status = "accepted"
        //     }
        // });

        // await user.save();
        // await sendingUser.save();

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Error Accepting Request' });
    };
}