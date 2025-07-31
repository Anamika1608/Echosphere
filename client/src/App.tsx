import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import { serverUrl } from './utils/index.ts';
import userStore from './store/userStore.ts';


import { Layout } from './app/Layout/Layout.tsx';
import Landing from './pages/Landing/Landing.tsx';
import Login from './app/Login/Login';
import Register from './app/Register/Register';
import Owner from './pages/Owner/Owner.tsx';
import Resident from './pages/Resident/Resident.tsx';
import { Toaster } from './components/ui/sonner.tsx';



function App() {
  const {auth} = userStore()
  
  useEffect(() => {
    const getUserProfile = async () => {
      const response = await axios.get(`${serverUrl}/api/auth/getUserProfile`, {
        withCredentials: true,
      });

      const { data } = response.data;

      auth.setUser(data)

      console.log("auth.user", auth.user)
      console.log("data after getUserPrfoeil", data)
    }
    getUserProfile()
  }, [])

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Landing />} />
        </Route>

        <Route path="/dashboard/owner" element={<Owner />} />
        <Route path="/dashboard/resident" element={<Resident />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;