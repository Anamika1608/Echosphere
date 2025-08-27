import React from 'react';
import { Card, CardHeader, CardTitle } from '../../../components/ui/card';
import { Mic, LayoutDashboard, Lightbulb, Bell } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion'


const freeTierFeatures = [
  {
    icon: Mic,
    title: (
      <>
        <strong className='font-bold'>Instantly create</strong> tickets by simply <strong className='font-bold'>speaking</strong> your issue.
      </>
    )
  },
  {
    icon: LayoutDashboard,
    title: (
      <>
        <strong className='font-bold'>Track</strong> issue statuses and community updates from your <strong className='font-bold'>Dashboard</strong>.
      </>
    )
  },
  {
    icon: Lightbulb,
    title: (
      <>
        Get <strong className='font-bold'>smart</strong>, AI ideas for engaging <strong className='font-bold'>community events</strong>.
      </>
    )
  },
  {
    icon: Bell,
    title: (
      <>
        Never miss a <strong className='font-bold'>high-priority issue</strong> with instant <strong className='font-bold'>auto-alerts</strong>.
      </>
    )
  }
];

const Features: React.FC = () => {
  const containerVariants: Variants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants: Variants = {
    initial: { opacity: 0, y: 40 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const iconVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.4, delay: 0.2 }
    }
  };

  return (
    <section
      id="features"
      className="container grid sm:grid-cols-2 sm:gap-6 mx-auto px-4 sm:px-16 py-16 sm:py-24"
      style={{
        backgroundImage: 'radial-gradient(292.12% 100% at 50% 0%,#ffffff 0%, #F9F7F5 10%, #FFF8F1 21.63%, #FFE4C9 45.15%, #FFE9C9 67.31%,#FFFAF3 100%)'
      }}
    >
      {/* Header Section */}
      <motion.div
        className="text-center sm:text-left mb-12 sm:pl-20"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.span
          className="text-sm sm:text-xl font-semibold text-gray-500"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          FREE-TIER FEATURES
        </motion.span>
        <motion.h2
          className="text-3xl sm:text-5xl sm:font-semibold font-bold tracking-tight mt-2 sm:w-[450px] leading-tight"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true, amount: 0.5 }}
        >
          All The Essentials, <span className="text-[#FF4500]">For Free</span>
        </motion.h2>
      </motion.div>

      {/* Cards Grid */}
      <motion.div
        className="grid grid-cols-2 sm:max-w-[600px] sm:gap-8 sm:grid-cols-2 lg:grid-cols-2 gap-6"
        variants={containerVariants}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.2 }}
      >
        {freeTierFeatures.map(({ icon: Icon, title }, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            whileHover={{
              y: -5,
              scale: 1.02,
              transition: { duration: 0.2 }
            }}
          >
            <Card
              className="text-left border-transparent rounded-[32px] sm:rounded-[44px] hover:border-[#FF4500] hover:shadow-xl transition-all duration-300 py-4 px-6 min-h-[200px] sm:min-h-auto"
              style={{
                backgroundColor: "#fff",
              }}
            >
              <CardHeader className="p-0">
                <motion.div
                  className="w-fit pt-2 mb-4"
                  variants={iconVariants}
                  whileHover={{
                    scale: 1.1,
                    rotate: 5,
                    transition: { duration: 0.2 }
                  }}
                >
                  <Icon className="w-8 h-8 sm:w-8 sm:h-8 text-[#FF4500]" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  <CardTitle className="text-gray-800 text-left text-base font-light leading-snug sm:mb-4">
                    {title}
                  </CardTitle>
                </motion.div>
              </CardHeader>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default Features;