import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import notfounfpic from '../../assets/notfonundpic.svg';
import Footer from "@/app/components/Footer/Footer";
import Navbar from "@/app/components/Navbar/Navbar";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div>
      <Navbar />
      <div
        className="flex flex-col items-center justify-center pt-20 mb-15 px-4"
        style={{
          backgroundImage:
            'radial-gradient(25.42% 52.24% at 50.03% 47.76%, #FFDBC8 0%, #FFF 100%)'
        }}
      >
        {/* Image animation */}
        <motion.img
          src={notfounfpic}
          alt="404 Not Found"
          className="w-1/4 my-20"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />

        {/* Button animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
        >
          <Button
            size="lg"
            asChild
            className="w-40 h-12 mb-20"
            style={{
              borderRadius: "12px",
              border: "1.26px solid #FFAA67",
              background:
                "linear-gradient(95deg, #FFD0A2 4.5%, #FEB070 13.38%, #FF994F 31.58%, #FF7835 57.33%, #FF661F 79.98%, #FF5000 96.85%)",
              boxShadow: "1.26px 3.78px 7.686px 0 rgba(0, 0, 0, 0.20)",
              color: "#fff"
            }}
          >
            <Link to="/">Go home</Link>
          </Button>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
