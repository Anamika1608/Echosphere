import { Routes, Route } from 'react-router-dom';
import { Layout } from './app/Layout/Layout.tsx';
import Landing from './pages/Landing/Landing.tsx';
import Login from './app/Login/Login';
import Register from './app/Register/Register';
import Owner from './pages/Owner/Owner.tsx';
import Resident from './pages/Resident/Resident.tsx';
import { Toaster } from './components/ui/sonner.tsx';
import { SmoothCursor } from "./components/ui/smooth-cursor";

function App() {
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
      <SmoothCursor />
    </>
  );
}

export default App;