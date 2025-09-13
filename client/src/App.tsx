import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
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
import ProtectedRoute from './components/route/ProtectedRoute.tsx';
import NotFound from './pages/NotFound/NotFound.tsx';
import CommunityDetailPage from './pages/Owner/CommunityDetailPage.tsx';

function App() {
  const { setUser, clearUser, setLoadingUserInfo } = userStore();

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        setLoadingUserInfo(true);
        const response = await axios.get(`${serverUrl}/auth/getUserProfile`, {
          withCredentials: true,
        });
        const { data } = response.data;
        setUser(data);

      } catch (error) {
        // Clear user data if there's an authentication error
        clearUser();
      } finally {
        setLoadingUserInfo(false);
      }
    };

    getUserProfile();
  }, [setUser, clearUser, setLoadingUserInfo]);

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