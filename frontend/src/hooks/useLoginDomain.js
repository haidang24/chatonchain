import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

const useLogin = () => {
	const [loading, setLoading] = useState(false);
	const { setAuthUser } = useAuthContext();

	const login = async (domainName) => {
		const success = handleInputErrors(domainName);
		if (!success) return;
		setLoading(true);
		try {
			const res = await fetch("/api/auth/login_domain", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify( { domainName } ),
			});

			const data = await res.json();
			if (data.error) {
				throw new Error(data.error);
			}

			localStorage.setItem("chat-user", JSON.stringify(data));
			setAuthUser(data);
		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	return { loading, login };
};
export default useLogin;

function handleInputErrors(domainName) {
	if (!domainName) {
		toast.error("Please fill in all fields");
		return false;
	}

	return true;
}
