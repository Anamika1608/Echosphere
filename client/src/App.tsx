import { Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { serverUrl } from './utils/index.ts';
import userStore from './store/userStore.ts';

import { Layout } from './app/Layout/Layout.tsx';
import Landing from './pages/Landing/Landing.tsx';
import Login from './app/Login/Login';
import Register from './app/Register/Register';
import OwnerDashboard from './pages/Owner/Owner.tsx';
import ResidentDashboard from './pages/Resident/Resident.tsx';
import { Toaster } from './components/ui/sonner.tsx';

import ProtectedRoute from './components/route/ProtectedRoute.tsx';
import NotFound from './pages/NotFound/NotFound.tsx';

import LoadingSpinner from './components/ui/loading.tsx';

function App() {
  const { setUser, user } = userStore();
  const [isLoading, setIsLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${serverUrl}/api/auth/getUserProfile`, {
          withCredentials: true,
        });

        const { data } = response.data;
        setUser(data);
        
        // console.log("User profile fetched:", data);
      } catch (error) {
        console.log("No user session found or error fetching profile:", error);
        // If there's an error (like no auth token), we still want to show the app
        // The user will be redirected to login by ProtectedRoute if needed
      } finally {
        setIsLoading(false);
        setAuthChecked(true);
      }
    };

    getUserProfile();
  }, [setUser]);

  // log user changes
  // useEffect(() => {
  //   if (user.id) {
  //     console.log("User state updated in store:", user);
  //   }
  // }, [user]);

  // Show loading spinner while checking authentication
  if (isLoading || !authChecked) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Landing />} />
        </Route>

        <Route path="/notFound" element={<NotFound />} />

        <Route path="/dashboard/owner" element={
          <ProtectedRoute allowedRoles={["PG_OWNER"]}>
            <OwnerDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/dashboard/resident" element={
          <ProtectedRoute allowedRoles={["RESIDENT"]}>
            <ResidentDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;