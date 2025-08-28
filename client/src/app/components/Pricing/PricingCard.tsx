import { Button } from '../../../components/ui/button';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { Check, X, Star, Shield } from 'lucide-react';
import { useRef, useState } from 'react';
import type { Variants } from 'framer-motion';

interface PricingCardProps {
    title: string;
    price: string;
    period: string;
    features: Array<{ name: string; included: boolean }>;
    buttonText: string;
    buttonLink: string;
    isPremium?: boolean;
    delay?: number;
}

const PricingCard: React.FC<PricingCardProps> = ({
    title,
    price,
    period,
    features,
    buttonText,
    buttonLink,
    isPremium = false,
    delay = 0
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const cardRef = useRef(null);
    const isInView = useInView(cardRef, { once: true, amount: 0.3 });

    const cardVariants: Variants = {
        initial: { opacity: 0, y: 50, scale: 0.9 },
        animate: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.8,
                delay,
                ease: [0.25, 0.46, 0.45, 0.94],
                type: "spring",
                stiffness: 100,
                damping: 15
            }
        }
    };

    const featureVariants: Variants = {
        initial: { opacity: 0, x: -20 },
        animate: (index: number) => ({
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.5,
                delay: delay + 0.3 + (index * 0.1),
                ease: "easeOut"
            }
        })
    };

    const iconVariants: Variants = {
        initial: { scale: 0, rotate: -180 },
        animate: (index: number) => ({
            scale: 1,
            rotate: 0,
            transition: {
                duration: 0.6,
                delay: delay + 0.4 + (index * 0.1),
                type: "spring",
                stiffness: 200,
                damping: 20
            }
        })
    };

    const priceVariants: Variants = {
        initial: { scale: 0.8, opacity: 0 },
        animate: {
            scale: 1,
            opacity: 1,
            transition: {
                duration: 0.6,
                delay: delay + 0.2,
                type: "spring",
                stiffness: 150,
                damping: 12
            }
        }
    };

    const badgeVariants: Variants = {
        initial: { y: -30, opacity: 0, scale: 0.8 },
        animate: {
            y: 0,
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.8,
                delay: delay + 0.1,
                type: "spring",
                stiffness: 120,
                damping: 15
            }
        }
    };

    const buttonVariants: Variants = {
        initial: { y: 20, opacity: 0 },
        animate: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.6,
                delay: delay + 0.8,
                ease: "easeOut"
            }
        },
        hover: {
            scale: 1.05,
            y: -2,
            transition: { duration: 0.2 }
        },
        tap: {
            scale: 0.98,
            y: 0,
            transition: { duration: 0.1 }
        }
    };

    return (
        <div>
            <motion.div
                ref={cardRef}
                className={`relative rounded-[15px] p-6 sm:p-8 text-center ${isPremium
                    ? 'border-2 border-white'
                    : 'bg-gray-50 border border-white'
                    } shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer`}
                style={
                    isPremium
                        ? {
                            background: "linear-gradient(180deg, #FFE7D0 1.11%, #FFF 92.07%)"
                        }
                        : {
                            background: "linear-gradient(180deg, #F5EFFF 1.11%, #fff 100%)"
                        }
                }
                variants={cardVariants}
                initial="initial"
                animate={isInView ? "animate" : "initial"}
                whileHover={{
                    scale: 1.03,
                    y: -8,
                    transition: { duration: 0.3, ease: "easeOut" }
                }}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
            >
                {/* Floating particles effect */}
                {isHovered && (
                    <>
                        {[...Array(6)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-2 h-2 bg-orange-300 rounded-full"
                                style={{
                                    top: `${20 + i * 15}%`,
                                    left: `${10 + i * 12}%`,
                                }}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{
                                    opacity: [0, 1, 0],
                                    scale: [0, 1, 0],
                                    y: [-20, -40, -60],
                                    x: [0, Math.random() * 20 - 10, 0]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    delay: i * 0.2
                                }}
                            />
                        ))}
                    </>
                )}

                {isPremium && (
                    <motion.div
                        className="absolute -top-4 left-1/2 transform -translate-x-1/2"
                        variants={badgeVariants}
                        initial="initial"
                        animate={isInView ? "animate" : "initial"}
                    >
                        <motion.span
                            className="bg-gradient-to-r from-orange-400 to-orange-600 text-orange-800 px-4 py-2 rounded-full text-sm font-semibold inline-flex items-center gap-1"
                            style={{
                                borderRadius: '16px',
                                border: '1px solid #FFF',
                                background: 'linear-gradient(180deg, #FFF 0%, #FFD7AE 56.5%, #FF9A72 113%)',
                            }}
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                            <Star className="w-4 h-4" />
                            Most Popular
                        </motion.span>
                    </motion.div>
                )}

                <div className="mb-6">
                    <motion.div
                        className="inline-flex items-center gap-2 mb-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: delay + 0.1 }}
                    >

                        <h3 className={`text-2xl sm:text-4xl py-4 font-bold ${isPremium ? 'text-orange-800' : 'text-gray-800'}`}>
                            {title}
                        </h3>
                    </motion.div>

                    <motion.div
                        className="flex items-baseline justify-center mb-1"
                        variants={priceVariants}
                        initial="initial"
                        animate={isInView ? "animate" : "initial"}
                    >
                        <motion.span
                            className={`text-4xl py-2 pb-2 sm:text-5xl font-bold ${isPremium ? 'text-orange-800' : 'text-gray-900'}`}
                            whileHover={{ scale: 1.1 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            {price}
                        </motion.span>
                        <span className="text-gray-500 ml-2 text-lg">/{period}</span>
                    </motion.div>
                </div>

                <div className="mb-8 space-y-4">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            className="flex items-center justify-start"
                            variants={featureVariants}
                            initial="initial"
                            animate={isInView ? "animate" : "initial"}
                            custom={index}
                            whileHover={{ x: 5, transition: { duration: 0.2 } }}
                        >
                            <motion.div
                                variants={iconVariants}
                                initial="initial"
                                animate={isInView ? "animate" : "initial"}
                                custom={index}
                            >
                                {feature.included ? (
                                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                                ) : (
                                    <X className="w-5 h-5 text-red-400 mr-3 flex-shrink-0" />
                                )}
                            </motion.div>
                            <span className={`text-left ${feature.included ? 'text-gray-700' : 'text-gray-400'}`}>
                                {feature.name}
                            </span>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    variants={buttonVariants}
                    initial="initial"
                    animate={isInView ? "animate" : "initial"}
                    whileHover="hover"
                    whileTap="tap"
                >
                    <Button
                        size="lg"
                        className={`w-full py-3 sm:py-6 text-base font-semibold rounded-[12px] transition-all duration-300 relative overflow-hidden ${isPremium
                            ? 'text-black shadow-lg hover:shadow-xl'
                            : 'bg-orange-100 hover:text-purple-600 text-black border border-orange-200'
                            }`}
                        style={
                            isPremium
                                ? {
                                    borderRadius: "16px",
                                    border: "1.26px solid #FFf",
                                    background: "linear-gradient(95deg, #FFD0A2 4.5%, #FEB070 13.38%, #FF994F 31.58%, #FF7835 57.33%, #FF661F 79.98%, #FF5000 96.85%)",
                                    boxShadow: "1.26px 3.78px 7.686px 0 rgba(0, 0, 0, 0.20)",
                                    color: "#fff"
                                }
                                : {
                                    borderRadius: '16px',
                                    border: '1px solid #FFF',
                                    background: 'linear-gradient(180deg, #FFF 0%, #E6D5FF 56.5%, #B2A1FF 113%)',
                                    boxShadow: '1px 3px 6.1px 0 rgba(0, 0, 0, 0.20)'
                                }
                        }
                        asChild
                    >
                        <Link to={buttonLink}>
                            <motion.span
                                className="relative z-10 flex items-center justify-center gap-2"
                                whileHover={{ scale: 1.05 }}
                            >
                                {isPremium && <Shield className="w-4 h-4" />}
                                {buttonText}
                            </motion.span>

                            {/* Button shine effect */}
                            <motion.div
                                className="absolute inset-0 bg-white opacity-0"
                                whileHover={{
                                    opacity: [0, 0.3, 0],
                                    x: [-100, 300],
                                    transition: { duration: 0.6, ease: "easeInOut" }
                                }}
                                style={{
                                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                                    transform: "skewX(-45deg)"
                                }}
                            />
                        </Link>
                    </Button>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default PricingCard;
