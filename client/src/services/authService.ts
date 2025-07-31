import axios from "axios";
import { serverUrl } from "@/utils";
import userStore from "@/store/userStore";

export const handleUserLogout = async (navigate: any) => {
    const { clearUser } = userStore()
    try {
        await axios.get(`${serverUrl}/auth/logout`, {
            withCredentials: true,
        });
    } catch (err) {
        console.error('Logout error:', err);
    } finally {
        clearUser();
        navigate('/');
    }
};
