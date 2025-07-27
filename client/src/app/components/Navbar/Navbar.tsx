import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleScrollLink = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    const targetId = e.currentTarget.href.split('#')[1];
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  const navLinks = [
    { href: '#features', label: 'Features' },
    { href: '#how-it-works', label: 'How It Works' },
    { href: '#faq', label: 'FAQs' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/40 bg-background/90 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-8
      ">
        <Link to="/" className="font-bold text-lg">CommunityAI</Link>
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} onClick={handleScrollLink} className="text-sm font-medium text-slate-600 hover:text-slate-900">
              {link.label}
            </a>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-2">
          <Button variant="ghost" asChild><Link to="/login">Login</Link></Button>
          <Button className="bg-[#FF4500] hover:bg-[#E03E00] text-white" asChild><Link to="/register">Sign Up</Link></Button>
        </div>
        <div className="md:hidden">
          <Button onClick={() => setIsOpen(!isOpen)} variant="ghost" size="icon">{isOpen ? <X /> : <Menu />}</Button>
        </div>
      </div>
      {isOpen && (
        <nav className="md:hidden p-4 border-t flex flex-col gap-4">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} onClick={handleScrollLink} className="font-medium text-slate-700">{link.label}</a>
          ))}
        </nav>
      )}
    </header>
  );
}
export default Navbar;