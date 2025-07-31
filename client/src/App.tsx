import { Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { serverUrl } from './utils/index.ts';
import userStore from './store/userStore.ts';
import { Layout } from './app/Layout/Layout.tsx';
import Landing from './pages/Landing/Landing.tsx';
import Login from './app/Login/Login';
import Register from './app/Register/Register';
import OwnerDashboard from './pages/Owner/OwnerDashboard.tsx';
import ResidentDashboard from './pages/Resident/ResidentDashboard.tsx';
import { Toaster } from './components/ui/sonner.tsx';
<<<<<<< HEAD
import ProtectedRoute from './components/route/ProtectedRoute.tsx';
import NotFound from './pages/NotFound/NotFound.tsx';
import LoadingSpinner from './components/ui/loading.tsx';
import { SmoothCursor } from "./components/ui/smooth-cursor.tsx"; 
=======

>>>>>>> 5a7b49b0831a7cd1564db2d2c65802fdff565d57

function App() {
  const { setUser, user, clearUser } = userStore();
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
        // Clear user data if there's an authentication error
        clearUser();
      } finally {
        setIsLoading(false);
        setAuthChecked(true);
      }
    };

    getUserProfile();
  }, [setUser, clearUser]);

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
        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
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
        
        <Route path="/notFound" element={<NotFound />} />
        
        {/* Catch all route - should be last */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;