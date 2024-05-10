import Message from "../../models/message.model.js";
import Conversation from "../../models/conversation.model.js";
import User from "../../models/user/user.model.js";
import { getReceiversSocketId, io } from "../../socket/socket.js";

export const sendMessage = async (req, res) => {
    try {
        const senderId = req.user.id;
        const receiverId = req.params.id;
        const { message } = req.body;

        const user = await User.findById(senderId);

        if(!user.friends.includes(receiverId)) {
            return res.status(403).json({success: false, error: "You cannot send a message to this user until they accpet your friend request"})
        };

        let conversation = await Conversation.findOne({ participants: { $all: [senderId, receiverId] } });
        if (!conversation) {
            conversation = new Conversation({
                participants: [senderId, receiverId]
            });
            await conversation.save();
        };

        const newMessage = new Message({
            senderId: senderId,
            receiverId: receiverId,
            message: message
        });

        await newMessage.save();
        if (newMessage) {
            conversation.messages.push(newMessage._id);
            await conversation.save();error
        };

        const receiversSocketId = getReceiversSocketId(receiverId);
        if(receiversSocketId) {
            io.to(receiversSocketId).emit("newMessage", newMessage)
        }

        res.status(200).json({
            success: true,
            newMessage: newMessage
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            error: "An Error Occured"
        })
    }
}

export const getMessage = async (req, res) => {
    try {
        const senderId = req.user.id;
        const chatUserId = req.params.id;

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, chatUserId] }
        }).populate("messages");

        if (!conversation) {
            return res.status(200).json({
                success: true,
                conversation: []
            })
        }

        res.status(200).json({
            success: true,
            conversation: conversation.messages
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            error: "An Error Occured"
        })
    }


}