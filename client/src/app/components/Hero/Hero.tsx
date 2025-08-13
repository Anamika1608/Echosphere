import { Button } from '../../../components/ui/button';
import { Link } from 'react-router-dom';
import TopGradient from '../../../assets/TopGradient.png';
import TopGradient2 from '../../../assets/TopGradient2.png';
import Spline from '@splinetool/react-spline';
import { motion } from 'framer-motion';

const Hero = () => {
    return (
        <section id="hero" className="container mx-auto px-0 pb-16 text-center">

            <motion.div
                className="sm:inset-0 z-0"
                style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', overflow: 'hidden' }}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
            >
                <img
                    src={TopGradient}
                    alt="Hero Gradient Small"
                    className="block md:hidden w-full h-full object-cover "
                />
                <img
                    src={TopGradient2}
                    alt="Hero Gradient Large"
                    className="hidden md:block w-full h-full object-cover"
                />
            </motion.div>

            <div className="relative z-10 mt-[-80px] sm:mt-[-160px]">
                <motion.h1
                    className="text-5xl leading-tight  md:text-6xl lg:text-7xl font-bold tracking-tighter max-w-xl sm:max-w-5xl mx-auto sm:mx-auto "
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                >
                    One place to manage your community living with{' '}<span className='text-orange-400'>Ecosphere</span>
                </motion.h1>

                <motion.p
                    className="mt-4 text-gray-500 max-w-[500px] mx-8 sm:mx-auto font-light"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                >
                    A faster approach to <strong className='font-bold'>Residential Community</strong> problems. Making <strong className='font-bold'>support instant</strong> and community building effortless.
                </motion.p>

                <motion.div
                    className="flex justify-center items-center h-[160px] sm:h-[223px] mt-6 mx-auto relative"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.7, ease: "easeOut" }}
                >
                    <Spline scene="../../../../../public/spline.spline" />

                    {/* Overlay div to disable interaction */}
                    <div className="absolute inset-0 z-10" style={{ cursor: 'default' }}></div>
                </motion.div>

                <motion.div
                    className="mt-8 flex flex-row sm:flex-row items-center justify-center gap-4 sm:mt-10"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.9, ease: "easeOut" }}
                >
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                        <Button size="lg" className="bg-[#FF6D2E] hover:bg-[#E03E00] text-white sm:w-auto" asChild>
                            <Link to="/login">Voice assistant</Link>
                        </Button>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                        <Button size="lg" className="bg-orange-100 hover:bg-[#E03E00] hover:text-white text-[#FF6D2E] sm:w-auto" asChild>
                            <Link to="/register">Start for free</Link>
                        </Button>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;