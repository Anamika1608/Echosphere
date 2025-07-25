import  {Outlet}  from 'react-router-dom';
import  Navbar  from '../components/Navbar/Navbar';
import  Footer  from '../components/Footer/Footer';

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F9F7F5]">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}