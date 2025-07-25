import { Routes, Route } from 'react-router-dom';
import { Layout } from './app/Layout/Layout.tsx';
import Landing from './app/Landing/Landing';
import Login from './app/Login/Login';
import Register from './app/Register/Register';
import Owner from './app/Dashboard/Owner/Owner.tsx';
import Resident from './app/Dashboard/Resident/Resident.tsx';
import { Toaster } from './components/ui/sonner.tsx';

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
    </>
  );
}

export default App;