import { useState } from "react";
import { Link } from "react-router-dom";
import useLogin from "../../hooks/useLoginDomain.js";

const Login = () => {
	const [domainName, setUsername] = useState("");

	const { loading, login } = useLogin();

	const handleSubmit = async (e) => {
		e.preventDefault();
		await login(domainName);
	};

	return (
		<div className='flex flex-col items-center justify-center min-w-96 mx-auto'>
			<div className='w-full p-6 rounded-lg shadow-md text-cyan-300 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0'>
				<h1 className='text-3xl font-semibold text-center text-gray-300'>
					Login
					<span className='text-blue-500'></span>
				</h1>

				{/* <form onSubmit={handleSubmit}> */ }
				<form method="POST" action="http://localhost:5000/login" >
					<div>
						<label className='label p-2'>
							<span className='text-base label-text text-white'>Domain Name</span>
						</label>
						<input
							type='text'
							placeholder='Enter Domain Name'
							className='w-full input input-bordered h-10'
							value={ domainName}
							name="domain"
							onChange={(e) => setUsername(e.target.value)}
						/>
					</div>
					<Link to='/login' className='text-sm  hover:underline hover:text-blue-400 mt-2 inline-block'>
						{"Login"} with Password<br/>
					</Link>
                    <br/>
					<Link to='/signup' className='text-sm  hover:underline hover:text-blue-400 mt-2 inline-block'>
						{"Don't"} have an account?
					</Link>
					<div>
						<button className='btn btn-block btn-sm mt-2 text-white'>
							{loading ? <span className='loading loading-spinner '></span> : "Authentication"}
						</button>
					</div>
					<div>
						<button className='btn btn-block btn-sm mt-2 text-white' onClick={handleSubmit}>
							{loading ? <span className='loading loading-spinner '></span> : "Login"}
						</button>
					</div>
					
				</form>
			</div>
		</div>
	);
};
export default Login;
