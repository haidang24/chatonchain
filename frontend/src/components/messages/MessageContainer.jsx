import { useEffect,useState } from "react";
import useConversation from "../../zustand/useConversation";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
import { TiMessages } from "react-icons/ti";
import { useAuthContext } from "../../context/AuthContext";

const MessageContainer = () => {
	const { selectedConversation, setSelectedConversation } = useConversation();
	const [showUserInfo, setShowUserInfo] = useState(false);

	useEffect(() => {
		// cleanup function (unmounts)
		return () => setSelectedConversation(null);
	}, [setSelectedConversation]);

	const Call_1 = () => {
		alert( "Call not setup" );
	}

	return (
		<div className='md:min-w-[450px] flex flex-col'>
			{!selectedConversation ? (
				<NoChatSelected />
			) : (
				<>
						{/* Header */ }		
             <div className='px-4 py-2 mb-2 flex items-center justify-between headerGradient' style={{ background: 'linear-gradient(to right, #667eea, #764ba2)', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
				<div className='flex items-center'>
					{selectedConversation.profilePic && (
									<img
										src={ selectedConversation.profilePic }
										style={ { width: '40px', height: '40px' } }
										alt={ `${ selectedConversation.fullName }` }
										className='rounded-full mr-2 profilePicStyling cursor-pointer hover:opacity-80'
										onClick={() => setShowUserInfo(true)}
									/>
								) }
								{/*  show information */}
										{showUserInfo && (
										<div className='fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md flex justify-center items-center p-4 z-50'>
											<div className='bg-white shadow-xl rounded-lg overflow-hidden'>
											<div className='p-4'>
												{/* Nội dung thông tin người dùng */}
												<div className='avatar-ring mx-auto'>
												<img
													src={selectedConversation.profilePic}
													alt={selectedConversation.fullName}
													className='block mx-auto w-24 h-24 object-cover rounded-full' />
												</div>
												<h3 className='mt-2 text-center text-xl font-bold'>
												{selectedConversation.fullName}
												</h3>
												<p className='text-center text-md mt-2'>
												Gender: {selectedConversation.gender || 'Not specified'}
												</p>
												<p className='text-center text-md mt-2'>
                                                Domain Name: {selectedConversation.domainName || 'Not specified'}
                                                </p>
												<button className='mt-4 bg-red-500 text-white rounded-md px-5 py-2 text-sm block mx-auto hover:bg-red-600 transition-colors' onClick={() => setShowUserInfo(false)}>
												Close
												</button>
											</div>
											</div>
										</div>
										)}									
									{/* ... */}
					<span 
									className='text-white font-bold text-lg textStyling cursor-pointer'
									onClick={() => setShowUserInfo(true)}
					>{ selectedConversation.fullName }</span>
				</div>
				<button
                  type='button' className='bg-white text-sky-600 py-2 px-4 rounded-full text-sm font-semibold shadow-sm hover:bg-sky-500 hover:text-white hover:shadow-lg transition-colors duration-150'
                  style={ { transition: 'all 0.3s' } }
				>
				<i
					className="fas fa-video hover:scale-110"
					style={ { transition: 'transform 0.2s' } } onClick={Call_1}>
				</i>
				</button>
				</div>
					<Messages />
					<MessageInput />
				</>
			)}
		</div>
	);
};
export default MessageContainer;

const NoChatSelected = () => {
	const { authUser } = useAuthContext();
	return (
		<div className='flex items-center justify-center w-full h-full'>
			<div className='px-4 text-center sm:text-lg md:text-xl text-gray-200 font-semibold flex flex-col items-center gap-2'>
				<p>Welcome 👋 {authUser.fullName}</p>
				<p>Select a chat to start messaging</p>
				<TiMessages className='text-3xl md:text-6xl text-center' />
			</div>
		</div>
	);
};

