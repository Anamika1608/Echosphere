import React from "react";
import {
  Home,
  Calendar,
  User,
  MessageCircle,
  LogOut,
} from "lucide-react";
import { FloatingDock } from "../../../components/ui/floating-dock";
import { Link } from "react-router-dom";

const navItems = [
  {
    title: "Home",
    icon: <Home className="text-[#FF4500]" />,
    href: "/home",
  },
  {
    title: "Schedule",
    icon: <Calendar className="text-[#FF4500]" />,
    href: "/schedule",
  },
  {
    title: "Messages",
    icon: <MessageCircle className="text-[#FF4500]" />,
    href: "/messages",
  },
  {
    title: "Profile",
    icon: <User className="text-[#FF4500]" />,
    href: "/profile",
  },
  {
    title: "Sign Out",
    icon: <LogOut className="text-[#FF4500]" />,
    href: "/logout",
  },
];

const Navbar: React.FC = () => {
  return (
    <div className="fixed bottom-2 md:bottom-4 left-0 right-0 z-50 flex justify-center">
      <FloatingDock
        items={navItems.map((item) => ({
          ...item,
          // keep original icon inside motion-enabled wrapper
          icon: item.icon,
        }))}
        className="bottom-4" // use one class only, both mobile and desktop
      />
    </div>
  );
};

export default Navbar;
