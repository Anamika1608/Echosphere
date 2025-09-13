import { Button } from '../../../components/ui/button';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { Check, X, Star, Shield } from 'lucide-react';
import { useRef, memo } from 'react';
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

const PricingCard: React.FC<PricingCardProps> = memo(({
    title,
    price,
    period,
    features,
    buttonText,
    buttonLink,
    isPremium = false,
    delay = 0
}) => {
    const cardRef = useRef(null);
    const isInView = useInView(cardRef, { once: true, amount: 0.3 });

    // Simplified animations for better performance
    const cardVariants: Variants = {
        initial: { opacity: 0, y: 30, scale: 0.95 }, // Reduced movement and scale
        animate: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.4, // Faster animation
                delay,
                ease: "easeOut" // Simpler easing
            }
        }
    };

    // Simplified variants for better performance
    const featureVariants: Variants = {
        initial: { opacity: 0, x: -10 }, // Reduced movement
        animate: (index: number) => ({
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.2, // Faster animation
                delay: delay + 0.1 + (index * 0.05), // Reduced delay
                ease: "easeOut"
            }
        })
    };

    const iconVariants: Variants = {
        initial: { scale: 0.8, opacity: 0 }, // Simplified initial state
        animate: (index: number) => ({
            scale: 1,
            opacity: 1,
            transition: {
                duration: 0.2, // Faster animation
                delay: delay + 0.15 + (index * 0.05), // Reduced delay
                ease: "easeOut" // Simpler easing
            }
        })
    };

    const priceVariants: Variants = {
        initial: { scale: 0.9, opacity: 0 }, // Less dramatic scale
        animate: {
            scale: 1,
            opacity: 1,
            transition: {
                duration: 0.3, // Faster animation
                delay: delay + 0.1,
                ease: "easeOut" // Simpler easing
            }
        }
    };

    const badgeVariants: Variants = {
        initial: { y: -15, opacity: 0, scale: 0.9 }, // Reduced movement
        animate: {
            y: 0,
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.3, // Faster animation
                delay: delay + 0.05,
                ease: "easeOut" // Simpler easing
            }
        }
    };

    const buttonVariants: Variants = {
        initial: { y: 10, opacity: 0 }, // Reduced movement
        animate: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.3, // Faster animation
                delay: delay + 0.2,
                ease: "easeOut"
            }
        },
        hover: {
            scale: 1.02, // Reduced scale
            y: -1, // Reduced movement
            transition: { duration: 0.15 } // Faster transition
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
                    scale: 1.02, // Reduced scale
                    y: -4, // Reduced movement
                    transition: { duration: 0.2, ease: "easeOut" } // Faster transition
                }}
            >
                {/* Removed heavy particle effects for better performance */}

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
                            whileHover={{ scale: 1.05, rotate: 2 }} // Reduced effects
                            transition={{ duration: 0.15 }} // Simpler transition
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
                            whileHover={{ scale: 1.05 }} // Reduced scale
                            transition={{ duration: 0.15 }} // Simpler transition
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
                            whileHover={{ x: 2, transition: { duration: 0.15 } }} // Reduced movement
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
                                whileHover={{ scale: 1.02 }} // Reduced scale
                            >
                                {isPremium && <Shield className="w-4 h-4" />}
                                {buttonText}
                            </motion.span>

                            {/* Removed heavy shine effect for better performance */}
                        </Link>
                    </Button>
                </motion.div>
            </motion.div>
        </div>
    );
});

PricingCard.displayName = 'PricingCard';

export default PricingCard;
