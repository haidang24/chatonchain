//
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import generateTokenAndSetCookie from "../utils/generateToken.js"; //cookie
import generateKeyPair from '../utils/createKey.js'; //keyPublic and keyPrivat

//FUNCTION SIGNUP
export const signup = async (req, res) => {
	try {
		//get information
		const { fullName, username,domainName, password, confirmPassword,gender } = req.body;

		//compare password
		if (password !== confirmPassword) {
			return res.status(400).json({ error: "Passwords don't match" });
		}

		//CHECK USER NAME ALREADY EXISTS
		const user = await User.findOne({ username });
		if (user) {
			return res.status(400).json({ error: "Username already exists" });
		}

		//CHECK DOMAIN NAME ALREADY EXISTS
		const user2 = await User.findOne({ domainName });
		if (user2) {
			return res.status(400).json({ error: "Domainname already exists" });
		}
		// HASH PASSWORD HERE
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

        //SET AVATAR RANDOM HERE
		const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
		const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

		//GENERATE KEY PAIRS HERE
		const { publicKey, privateKey } = generateKeyPair();

		// create a new user
		const newUser = new User({
			fullName,
			username,
			domainName,
			password: hashedPassword,
			gender,
			profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
            keypublic: publicKey,
            keyprivate: privateKey,
		});

		// SAVE USER
		if (newUser) {
			// Generate JWT token here
			generateTokenAndSetCookie(newUser._id, res);
			await newUser.save();

			res.status(201).json({
				_id: newUser._id,
				fullName: newUser.fullName,
				username: newUser.username,
				domainName: newUser.domainName,
				profilePic: newUser.profilePic,
		        keypublic: newUser.keypublic
			});
		} else {
			res.status(400).json({ error: "Invalid user data" });
		}
	} catch (error) {
		console.log("Error in signup controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

//FUNCTION LOGIN WITH USERNAME AND PASSWORD
export const login = async (req, res) => {
	try {
		const { username, password } = req.body;
		const user = await User.findOne({ username });
		const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

		if (!user || !isPasswordCorrect) {
			return res.status(400).json({ error: "Invalid username or password" });
		}

		generateTokenAndSetCookie(user._id, res);

		res.status(200).json({
			_id: user._id,
			fullName: user.fullName,
			username: user.username,
			profilePic: user.profilePic,
			keypublic: user.keypublic
		});
	} catch (error) {
		console.log("Error in login controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
//FUCNTION LOGIN WITH DOMAIN NAME
export const login_domain = async (req, res) => {
	try {
		const { domainName } = req.body;
		const user = await User.findOne({ domainName});
        
		if (!user) {
			return res.status(400).json({ error: "Not Found Domain Name" });
		
		}	// } else {
		// 	///
		const results = req.session.domain || "none";
		if ( !results )
		{
			return res.status(400).json({ error: "Not authencation" });
		}
		// }
		if ( results===domainName)
		{
			generateTokenAndSetCookie( user._id, res );	
			res.status(200).json({
			_id: user._id,
			fullName: user.fullName,
			username: user.username,
			domain: user.domainName,
			profilePic: user.profilePic,
			keypublic: user.keypublic
		});
		} else
		{
			return res.status(400).json({ error: "Correct domain Name" });
		}
		
	} catch (error) {
		console.log("Error in login controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};


//FUNCTION LOGOUT
export const logout = (req, res) => {
	try {
		res.cookie("jwt", "", { maxAge: 0 });
		req.session.destroy;
		res.status( 200 ).json( { message: "Logged out successfully" } );
	} catch (error) {
		console.log("Error in logout controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}

};
