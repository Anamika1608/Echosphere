import { Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { serverUrl } from './utils/index.ts';
import userStore from './store/userStore.ts';
import { Layout } from './app/Layout/Layout.tsx';
import Landing from './pages/Landing/Landing.tsx';
import Login from './app/Login/Login';
import Register from './app/Register/Register';
import PgOwnerDashboard from './pages/Owner/OwnerDashboard.tsx';
import ResidentDashboard from './pages/Resident/ResidentDashboard.tsx';
import { Toaster } from './components/ui/sonner.tsx';
import LoadingSpinner from './components/ui/loading.tsx';
import ProtectedRoute from './components/route/ProtectedRoute.tsx';
import NotFound from './pages/NotFound/NotFound.tsx';
import CommunityDetailPage from './pages/Owner/CommunityDetailPage.tsx';

function App() {
  const { setUser, clearUser } = userStore();
  const [isLoading, setIsLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${serverUrl}/auth/getUserProfile`, {
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

  useEffect(() => {
    const setUserToRedis = async () => {
      const response = await axios.get(`${serverUrl}/auth/setWidgetSessionUserId`, {
        withCredentials: true
      });
      console.log("response after setting up userId in redis", response)
    }
    setUserToRedis()
  },[])

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

        {/* <Route path="/dashboard/owner" element={
          <ProtectedRoute allowedRoles={["PG_OWNER"]}>
            <OwnerOldDashboard />
          </ProtectedRoute>
        } /> */}

        <Route path="/dashboard/owner" element={
          <ProtectedRoute allowedRoles={["PG_OWNER"]}>
            <PgOwnerDashboard />
          </ProtectedRoute>
        } />

        <Route path="/community/:id" element={
          <ProtectedRoute allowedRoles={["PG_OWNER"]}>
            <CommunityDetailPage />
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