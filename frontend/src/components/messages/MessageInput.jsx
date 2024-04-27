// Import
import { useState } from "react";
import { BsSend } from "react-icons/bs";
import useSendMessage from "../../hooks/useSendMessage";
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

//Main
const MessageInput = () => {
	//declare hooks
	const [ message, setMessage ] = useState( "" );
	const {loading, sendMessage } = useSendMessage();
	const [showPicker, setShowPicker] = useState(false);
	const [selectedFile, setSelectedFile ] = useState( null );
	const [ fileName, setFileName ] = useState( "" );
	//declare variables formData to send
	const formData = new FormData();
	// 
    //submit
	const handleSubmit = async ( e ) => {
		e.preventDefault(); 
		if (!message && !selectedFile) return;  //check data 
		formData.append( 'message', message ); // append message to form data 
		formData.append( 'file', selectedFile ); // append file to form data
		await sendMessage(formData);  // send message 
		setMessage( "" ); //set the message
		setFileName( "" );  //set the file name
		setSelectedFile( null );//set selected null
		setShowPicker( false ); //set 
	};
	
	//emoji picker
    const addEmoji = (e) => {
        let emoji = e.native;
        setMessage(message + emoji);
	};
	
	//file picker
	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (file) {
            setSelectedFile(file);   //  set selected file 
			setFileName( file.name ); // Save file name
		}
	};
	//render 
	return (
		<div>

            {/* show file when choose */}
			<p style={ { marginLeft: "20px" } }>{ fileName }</p> 
			{/*  */}
			{/* form send message */ }
			<form className='px-4 my-3' onSubmit={ handleSubmit }>	 
				<div className='px-4 my-3 flex items-center'>
					
					{/* input data */ }
                    <input  
                       type='text'
                       className='border text-sm rounded-lg flex-grow p-2.5 bg-gray-700 border-gray-600 text-white'
                       placeholder='Send a message'
                       value={message}
                       onChange={(e) => setMessage(e.target.value)}
					/>	
                    {/*  */}
					{/*Choose emojis */ }			
                    <button
						type='button'
						className='ml-2'
						style={ { fontSize: '25px' } }
						onClick={ () => setShowPicker( val => !val ) }   
					>
						😊
					</button>
					{/*  */ }
					
					{/* button choose file */ }
					<input
						type="file"
						id="fileInput"
						style={{ display: 'none' }}
						onChange={handleFileChange} // Cập nhật hàm xử lý file
					/>
                    <label htmlFor="fileInput" className="button-styles text-white" style={{fontSize: '20px', color: 'white' }}>
                      📎
					</label>
					{/*  */ }
					
					{/* button submit */ }
					<button
					type='submit'
						className='ml-2'
					style={{fontSize: '25px' }}>
                    {loading ? <div className='loading loading-spinner'></div> : <BsSend />}
					</button>
					{/*  */}
            </div>
			</form>
            {/*  */}
			{/* show emojis */}
              {showPicker && (
                <Picker data={data} onEmojiSelect={addEmoji} />
               )}
			{/*  */ }
			
		</div>
	);
};
// 

//export default
export default MessageInput;
