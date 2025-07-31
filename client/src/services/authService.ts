import axios from "axios";
import { serverUrl } from "@/utils";
import userStore from "@/store/userStore";
import { useNavigate } from "react-router-dom";

export const handleUserLogout = async () => {
    const { clearUser } = userStore()
    const navigate = useNavigate()
    try {
        await axios.get(`${serverUrl}/api/auth/logout`, {
            withCredentials: true,
        });
    } catch (err) {
        console.error('Logout error:', err);
    } finally {
        clearUser();
        navigate('/');
    }
};