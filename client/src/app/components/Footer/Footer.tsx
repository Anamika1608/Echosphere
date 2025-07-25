import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200/60">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center py-6 px-4 gap-4">
        <p className="text-sm text-slate-500 text-center sm:text-left">
          © {new Date().getFullYear()} Community-AI by Team Bugs Bunny.
        </p>
        <div className="flex items-center gap-6">
          <Link to="#" className="text-sm text-slate-500 hover:text-slate-800">Privacy Policy</Link>
          <Link to="#" className="text-sm text-slate-500 hover:text-slate-800">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
