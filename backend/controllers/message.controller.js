//import 
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
import User from "../models/user.model.js";
import crypto from "crypto";
import AWS from "aws-sdk";

// Hàm upload file S3
const uploadFileToS3 = async (file) => {
AWS.config.update({
    accessKeyId: "....................",
    secretAccessKey: "...................",
    region: "us-west-2"
} );

    const s3 = new AWS.S3();
    const params = {
        Bucket: 'chatonchain',
        Key: file.originalname,
        Body: file.buffer,
        ACL: "public-read"
    };

    try {
        const data = await s3.upload(params).promise();
        console.log(`File uploaded successfully at ${data.Location}`);
        return data.Location;
    } catch (error) {
        console.error("Error uploading file to S3:", error);
        throw new Error("Failed to upload file to S3");
    }
};

// Gửi tin nhắn
export const sendMessage = async (req, res) => {
    try {
        const { id: receiverId } = req.params;
        const senderId = req.user._id;
        const messageContent = req.body.message;
        const file = req.file;

        // Upload file to S3 (if exists)
        let fileUrl = null;
        if (file) {
            fileUrl = await uploadFileToS3(file);
        }

        // Tạo tin nhắn mới
        const newMessage = new Message({
            senderId,
            receiverId,
            message: messageContent,
            file: fileUrl
        });

        // Tìm hoặc tạo conversation
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        });
        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId]
            });
        }

        // Thêm tin nhắn mới vào conversation
        conversation.messages.push(newMessage._id);

        // Lưu conversation và tin nhắn mới
        await Promise.all([conversation.save(), newMessage.save()]);

        // Gửi tin nhắn mới đến người nhận qua socket IO
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.error("Error in sendMessage controller:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Lấy danh sách tin nhắn
export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const senderId = req.user._id;

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, userToChatId] }
        }).populate("messages");

        if (!conversation) {
            return res.status(200).json([]);
        }

        const messages = conversation.messages;
        res.status(200).json(messages);
    } catch (error) {
        console.error("Error in getMessages controller:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
