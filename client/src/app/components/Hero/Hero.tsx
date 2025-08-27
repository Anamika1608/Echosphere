import { Button } from '../../../components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Spline from '@splinetool/react-spline';
import img1 from '../../../assets/img1.png';
import img2 from '../../../assets/img2.png';
import bgimage from '../../../assets/bgimage.png';

const Hero = ({ demoLink = 'https://www.youtube.com/embed/dQw4w9WgXcQ' }) => {
    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: "easeOut" }
    };


    const fadeIn = {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.8 }
    };

    const subtleHover = {
        scale: 1.02,
        transition: { duration: 0.2 }
    };

    return (
        <section
            id="hero"
            className="container mx-auto -mt-16 px-0 pb-16 text-center"
            style={{
                backgroundImage: `url(${bgimage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
        >
            {/* Side images with subtle fade */}
            <motion.div
                className="absolute left-25 top-0 h-60 w-60 flex items-center mb-0 mt-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
            >
                <img src={img1} alt="" />
            </motion.div>

            <motion.div
                className="absolute right-25 top-0 h-60 w-60 flex items-center mb-0 mt-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.4 }}
            >
                <img src={img2} alt="" />
            </motion.div>

            <div className="relative z-10">
               {/* @ts-ignore */}
                <motion.h1
                    className="text-xl pt-30 leading-tight md:text-6xl lg:text-6xl font-bold tracking-tighter max-w-xl sm:max-w-5xl mx-auto sm:mx-auto"
                    {...fadeInUp}
                >
                    One place to manage your community living with{' '}
                    <span className='text-orange-400'>Echosphere</span>
                </motion.h1>

                {/* Description with slight delay */}
                <motion.p
                    className="mt-4 text-gray-500 mx-8 sm:mx-auto font-light"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    A faster approach to <strong className='font-bold'>Residential Community</strong> problems.
                    Making <strong className='font-bold'>support instant</strong> and community building effortless.
                </motion.p>

                {/* Spline container */}
                <motion.div
                    className="flex justify-center items-center h-[160px] sm:h-[223px] mt-6 mx-auto relative"
                    {...fadeIn}
                    transition={{ delay: 0.4 }}
                >
                    <Spline scene="../../../../../public/spline.spline" />
                    <div className="absolute inset-0 z-10" style={{ cursor: 'default' }}></div>
                </motion.div>

                {/* Buttons with subtle hover */}
                <motion.div
                    className="mt-8 flex flex-row sm:flex-row items-center justify-center gap-4 sm:mt-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                >
                    <motion.div whileHover={subtleHover}>
                        <Button
                            size="lg"
                            asChild
                            style={{
                                borderRadius: "12px",
                                border: "1.26px solid #FFAA67",
                                background: "linear-gradient(95deg, #FFD0A2 4.5%, #FEB070 13.38%, #FF994F 31.58%, #FF7835 57.33%, #FF661F 79.98%, #FF5000 96.85%)",
                                boxShadow: "1.26px 3.78px 7.686px 0 rgba(0, 0, 0, 0.20)",
                                color: "#fff"
                            }}
                        >
                            <Link to="/login">Voice assistant</Link>
                        </Button>
                    </motion.div>

                    <motion.div whileHover={subtleHover}>
                        <Button
                            size="lg"
                            className="bg-orange-100 hover:bg-[#E03E00] hover:text-white rounded-[12px] text-[#FF6D2E] sm:w-auto transition-colors duration-300"
                            asChild
                        >
                            <Link to="/register">Start for free</Link>
                        </Button>
                    </motion.div>
                </motion.div>

                {/* Demo video with gentle reveal */}
                <motion.div
                    className="relative z-30 max-w-4xl mx-auto mt-20 px-4"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true, amount: 0.2 }}
                >
                    <motion.div
                        className="rounded-[15px] overflow-hidden"
                        style={{
                            background: '#F4F4F4',
                            boxShadow: '0 15px 30px rgba(0,0,0,0.12)',
                            border: '8px solid rgba(255,255,255,0.95)'
                        }}
                        whileHover={{
                            scale: 1.01,
                            transition: { duration: 0.3 }
                        }}
                    >
                        <div className="w-full aspect-video">
                            <iframe
                                className="w-full h-full"
                                src={demoLink}
                                title="Demo video"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;