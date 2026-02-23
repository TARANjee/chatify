import Message from "../models/Message.js";
import User from "../models/User.js";
import cloudinary from '../lib/cloudinary.js'

export const getAllContacts = async (req, res) => {
    try {
        const LoggedInUserId = req.user._id; 
        const filteredUsers= await User.find({ _id: { $ne: LoggedInUserId } }).select('-password');

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

export const getMessagesByUserId = async (req, res) => {
    try {
        const { id:userToChatId } = req.params;
        const myId = req.user._id;

        const message = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId }
            ]
        }).sort({ createdAt: 1 });

        res.status(200).json(message);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server error' });
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { id:receiverId } = req.params;
        const senderId = req.user._id;
        const { text,image } = req.body;

        let imageUrl;
        if (image) {
            //upload base64 image to cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl
        });

         await newMessage.save();

         //todo: send this message to the receiver using socket.io
        res.status(201).json(newMessage);

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Internal Server error' });
    }


}

export const getChatPartners = async (req, res) => {
    try {
        const myId = req.user._id;

        // Find all messages where the logged-in user is either the sender or receiver
        const messages = await Message.find({
            $or: [
                { senderId: myId },
                { receiverId: myId }
            ]
        });

        // Extract unique user IDs of chat partners
        const chatPartnerIds = [
            ...new Set(
            messages.map(msg => 
                msg.senderId.toString() === myId.toString()
                 ? msg.receiverId.toString()
                 : msg.senderId.toString()
                )
            )
        ];

        const chatPartners = await User.find({ _id: { $in: chatPartnerIds } }).select('-password');

        res.status(200).json(chatPartners);
        
    } catch (error) {
        console.error("Error in getChatPartners:",error.message);
        res.status(500).json({ error: 'Internal Server error' });
    }
}