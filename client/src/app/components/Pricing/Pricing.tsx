import React, { useRef } from 'react';
import { useInView } from 'framer-motion';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import PricingCard from "./PricingCard";
import type { Variants } from 'framer-motion';


const Pricing: React.FC = () => {
    const headerRef = useRef(null);
    const ctaRef = useRef(null);
    const headerInView = useInView(headerRef, { once: true, amount: 0.5 });
    const ctaInView = useInView(ctaRef, { once: true, amount: 0.5 });

    const titleVariants: Variants = {
        initial: { opacity: 0, y: 30 },
        animate: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94]
            }
        }
    };

    const subtitleVariants: Variants = {
        initial: { opacity: 0, y: 20 },
        animate: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                delay: 0.3,
                ease: "easeOut"
            }
        }
    };

    const freeFeatures = [
        { name: "Manual issue/service request via form", included: true },
        { name: "Basic support tickets", included: true },
        { name: "Auto assignment of technician", included: true },
        { name: "Auto broadcasting of events", included: false },
        { name: "Voice-based requests", included: false },
        { name: "Auto call to technician", included: false },
    ];

    const premiumFeatures = [
        { name: "Voice-based issue/service request", included: true },
        { name: "Priority support tickets", included: true },
        { name: "Auto assignment of technician", included: true },
        { name: "Auto broadcasting of events", included: true },
        { name: "Auto call to technician", included: true },
    ];


    return (
        <section id="pricing" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background animated elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-64 h-64 rounded-full bg-gradient-to-r from-orange-100/20 to-purple-100/20 blur-3xl"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            x: [0, Math.random() * 100 - 50],
                            y: [0, Math.random() * 100 - 50],
                            scale: [1, 1.2, 1],
                        }}
                        transition={{
                            duration: Math.random() * 10 + 10,
                            repeat: Infinity,
                            repeatType: "reverse",
                            ease: "easeInOut"
                        }}
                    />
                ))}
            </div>

            <div className="container mx-auto max-w-6xl relative z-10">
                {/* Header */}
                <motion.div
                    ref={headerRef}
                    className="text-center mb-12 sm:mb-16"
                    initial="initial"
                    animate={headerInView ? "animate" : "initial"}
                >
                    <motion.h2
                        className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter mb-4"
                        variants={titleVariants}
                    >
                        Choose Your{' '}
                        <span className='text-orange-400'>
                            Community Plan
                        </span>
                    </motion.h2>

                    <motion.p
                        className="text-gray-500 text-lg sm:text-lg max-w-2xl mx-auto font-light"
                        variants={subtitleVariants}
                    >
                        Start building your{' '}
                        <motion.strong
                            className="font-bold text-gray-700"
                            whileHover={{ scale: 1.05, color: "#f97316" }}
                            transition={{ duration: 0.2 }}
                        >
                            residential community
                        </motion.strong>{' '}
                        today. Upgrade anytime as your community grows.
                    </motion.p>
                </motion.div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 max-w-[850px] mx-auto">
                    <PricingCard
                        title="Free"
                        price="$0"
                        period="m"
                        features={freeFeatures}
                        buttonText="Get Started Free"
                        buttonLink="/register"
                        delay={0.2}
                    />

                    <PricingCard
                        title="Premium"
                        price="$29"
                        period="m"
                        features={premiumFeatures}
                        buttonText="Contact Us"
                        buttonLink="mailto:anamikagg07@gmail.com"
                        isPremium={true}
                        delay={0.4}
                    />
                </div>

                {/* Bottom CTA */}
                <motion.div
                    ref={ctaRef}
                    className="text-center mt-12 sm:mt-16"
                    initial={{ opacity: 0, y: 30 }}
                    animate={ctaInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <motion.p
                        className="text-gray-600 mb-4"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                    >
                        Need an AI assistant to manage your large community?
                    </motion.p>

                    <motion.div
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.98, y: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Button
                            variant="outline"
                            size="lg"
                            className="border-orange-200 text-orange-600 hover:bg-orange-50 rounded-[12px] px-6 py-3 relative overflow-hidden"
                            asChild
                        >
                            <Link to="/register">
                                <motion.span
                                    className="relative z-10"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    Start free trial
                                </motion.span>

                                {/* Button background animation */}
                                <motion.div
                                    className="absolute inset-0 bg-orange-50 rounded-[12px]"
                                    initial={{ scale: 0 }}
                                    whileHover={{ scale: 1 }}
                                    transition={{ duration: 0.3 }}
                                />
                            </Link>
                        </Button>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default Pricing;