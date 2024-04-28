//import 
import { useAuthContext } from "../../context/AuthContext";
import { extractTime } from "../../utils/extractTime";
import useConversation from "../../zustand/useConversation";

//
const Message = ( { message } ) => {
	
	const { authUser } = useAuthContext();
	const { selectedConversation } = useConversation(); // 
	const fromMe = message.senderId === authUser._id; // fromMe
	const formattedTime = extractTime(message.createdAt); // formattedTime
	const chatClassName = fromMe ? "chat-end" : "chat-start";  //set class
	const profilePic = fromMe ? authUser.profilePic : selectedConversation?.profilePic; //set profile	
	const bubbleBgColor = fromMe ? "bg-blue-500" : "";  //set color 
	const shakeClass = message.shouldShake ? "shake" : ""; //set shake class
	const displayName = fromMe ? "You" : selectedConversation?.fullName || 'Someone'; //set display name

	//check file image
   const messageImage = message.file ? (
    <div className="message-image-container mt-2">
      <img src={message.file}  
        alt="error"
        style={{maxWidth: "300px", maxheight: "350px"}}
        className="message-image rounded-lg shadow-md"
      />
    </div>
  ) : null;

	return (
		<div className={`chat ${chatClassName}`}>
			<div className='chat-image avatar'>
				<div className='w-10 rounded-full'>
					<img style={{borderRadius:"20px"}} alt='Tailwind CSS chat bubble component' src={profilePic} />
				</div>
			</div>
			<div className={ `chat-bubble text-white ${ bubbleBgColor } ${ shakeClass } pb-2` }>
				{ message.message }
                { messageImage}
			</div>
			<div className='cursor-pointer chat-footer opacity-50 text-xs flex gap-1 items-center hover:opacity-100'>
				<span className='font-bold hover:text-white'>{displayName}</span>
				{formattedTime}
			</div>
		</div>
	);
};

//export
export default Message;
