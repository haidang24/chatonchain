//USER MOEDEL
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		//show full name
		fullName: {
			type: String,
			required: true,
		},
	    //user name for login
		username: {
			type: String,
			required: true,
			unique: true,
		},

		//domain and password name for login
		domainName: {
			type: String,
			required: false,
		},	
		password: {
			type: String,
			required: true,
			minlength: 6,
		},
		//gender: male or female
		gender: {
			type: String,
			required: true,
			enum: ["male", "female"],
		},
		//picture for avatar
		profilePic: {
			type: String,
			default: "",
		},
		//public
		keypublic: {
            type: String,
			required: false,
		},
		//private
        keyprivate: {
            type: String,
            required: false
		},
		//friend list
		friends: [
			{
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            }
		]
	},

	//create time
	{ timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
