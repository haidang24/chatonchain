//import 
import { getReceiverSocketId, io } from "../socket/socket.js";
import User from "../models/user.model.js";

export const call = async ( req, res ) => {
	try
	{
		//declare
		const { id: receiverId } = req.params;
        const senderId = req.user._id;
        
		// SOCKET IO FUNCTIONALITY WILL GO HERE
        const receiverSocketId = getReceiverSocketId( receiverId );
		if (receiverSocketId) {
            io.to( receiverSocketId ).emit( "newCall", {
                senderId: senderId,
                data: rtcwebsoclet
            } );
        }
        // io.to( receiverSocketId ).emit( "newCall", {} );

		res.status(201).json("Call success");
	} catch (error) {
		console.log("Error in call controller: ");
		res.status(500).json({ error: "Internal server error" });
	}
};

