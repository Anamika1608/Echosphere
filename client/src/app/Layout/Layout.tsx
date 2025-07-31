import  {Outlet}  from 'react-router-dom';
import NavBar from '../components/Navbar/Navbar';
import  Footer  from '../components/Footer/Footer';

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F9F7F5]">
      <NavBar className="fixed bottom-0 left-0 w-full z-50"/>
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}