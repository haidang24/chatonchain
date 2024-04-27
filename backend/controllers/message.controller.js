//import 
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
import User from "../models/user.model.js";
import crypto from "crypto";
//send
export const sendMessage = async (req, res) => {
	try
	{
		//declare
		const message = req.body.message;
		const { id: receiverId } = req.params;
		const senderId = req.user._id;
	    
		//check file
		let file;
		if (!req.file) {
			file = null;
		} else {
			file = req.file.path;
		}
        
		//conversation
		let conversation = await Conversation.findOne({
			participants: { $all: [senderId, receiverId] },
		});

		//check
		if (!conversation) {
			conversation = await Conversation.create({
				participants: [senderId, receiverId],
			});
		}
        

		// const user = await User.findOne( { _id: receiverId } );
		// console.log( user.keypublic );
        // const publicKey = user.keypublic;
        // const data = message;
        // const message_encrypt = (data, publicKey) => {
        //   const encryptedData = crypto.publicEncrypt(publicKey, Buffer.from(data));
        //   return encryptedData.toString('base64');
        // };
        // const message_encrypted = message_encrypt(data, publicKey);
		
		//Creat object message
		const newMessage = new Message( {
			senderId,
			receiverId,
			message,
			file: file,
		} );
        //add the new message to the conversation
		if (newMessage) {
			conversation.messages.push(newMessage._id);
		}

		// this will run in parallel
		await Promise.all([conversation.save(), newMessage.save()]);

		// SOCKET IO FUNCTIONALITY WILL GO HERE
		const receiverSocketId = getReceiverSocketId(receiverId);
		if (receiverSocketId) {
			// io.to(<socket_id>).emit() used to send events to specific client
			io.to(receiverSocketId).emit("newMessage", newMessage);
		}

		res.status(201).json(newMessage);
	} catch (error) {
		console.log("Error in sendMessage controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

//get message
export const getMessages = async (req, res) => {
	try {
		const { id: userToChatId } = req.params;
		const senderId = req.user._id;
        
		//TEST RSA

       	// const user = await User.findOne( { _id: userToChatId } );
		// console.log( user.keypublic );
		// const privateKey = user.keyprivate;
		// const decrypt = (encryptedData, privateKey) => {
        //      const decryptedData = crypto.privateDecrypt(privateKey, Buffer.from(encryptedData, 'base64'));
        //      return decryptedData.toString();
		// };
		
		// const message=decrypt{...., privateKey };

		const conversation = await Conversation.findOne({
			participants: { $all: [senderId, userToChatId] },
		}).populate("messages"); // NOT REFERENCE BUT ACTUAL MESSAGES
        // console.log(conversation);
		
		// conversation = maps.conversation(
		// 	conversation.messages=decrypt(conversation.messages, privateKey)
		// )
   		
		if (!conversation) return res.status(200).json([]);
            
		const messages = conversation.messages;
		res.status(200).json(messages);
	} catch (error) {
		console.log("Error in getMessages controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};
