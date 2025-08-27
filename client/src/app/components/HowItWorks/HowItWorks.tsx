import Icon1 from '../../../assets/Icon1.svg';
import Icon2 from '../../../assets/Icon2.svg';
import Icon3 from '../../../assets/Icon3.svg';
import Icon4 from '../../../assets/Icon4.svg';
import Icon5 from '../../../assets/Icon5.svg';
import { motion } from 'framer-motion';

const steps = [
  { 
    num: 1, 
    title: 'You Talk', 
    description: 'Resident reports, "My Wi-Fi is down!" into the app.',
    icon: (
      <img src={Icon1} alt="Icon 1" className='w-10 h-10'/>
    )
  },
  { 
    num: 2, 
    title: 'AI listens', 
    description: 'The system understands it\'s a "Wi-Fi complaint."',
    icon: (
      <img src={Icon2} alt="Icon 1" className='w-10 h-10'/>
    )
  },
  { 
    num: 3, 
    title: 'AI acts', 
    description: 'Instantly "creates a ticket & assigns" the right technician.',
    icon: (
      <img src={Icon3} alt="Icon 1" className='w-10 h-10'/>
    )
  },
  { 
    num: 4, 
    title: 'Get Reply', 
    description: 'AI confirms, "Okay, a ticket is created and assigned."',
    icon: (
      <img src={Icon4} alt="Icon 1" className='w-10 h-10'/>
    )
  },
  { 
    num: 5, 
    title: 'All done', 
    description: 'The issue is fixed, and the "ticket is automatically closed."',
    icon: (
      <img src={Icon5} alt="Icon 1" className='w-10 h-10'/>
    )
  },
];

const HowItWorks = () => {
  // Animation variants
  const containerVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const stepVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: ["easeOut"] }
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

  const lineVariants = {
    initial: { scaleX: 0 },
    animate: { 
      scaleX: 1,
      transition: { duration: 0.8, delay: 0.5, ease: ["easeOut"] }
    }
  };

  return (
    <section
      id="how-it-works"
      className="py-16 bg-white sm:py-24 relative"
    >
      {/* Desktop background */}
      <div
        className="hidden sm:block absolute inset-0 w-full h-full bg-cover bg-center z-0"
         style={{ backgroundImage: 'radial-gradient(292.12% 100% at 50% 0%, #FFFAF3 0%, #FFF8F1 21.63%, #FFE4C9 45.15%, #FFE9C9 67.31%,#F9F7F5 100%)' }}
        aria-hidden="true"
      />
      {/* Mobile background */}
      <div
        className="block sm:hidden absolute inset-0 w-full h-full bg-cover bg-center z-0"
        style={{ backgroundImage: 'radial-gradient(235.3% 97.37% at 35.43% 3.73%, #FEFEFE 0%, #FFE4C9 53.26%, #FFFAF3 100%)' }}
        aria-hidden="true"
      />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-gray-900 sm:pb-8">How it works</h2>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          {/* Top Row - 3 steps with connecting lines for large screens */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 sm:gap-8 gap-14 mb-14 sm:mb-16 relative"
            variants={containerVariants}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.2 }}
          >
            {/* Connecting lines for top row */}
            <div className="hidden md:block absolute top-9 left-0 w-full h-px z-0">
              <div className="flex items-center h-full px-50">
                <motion.div 
                  className="flex-1 h-px border-t-2 border-dashed border-gray-400"
                  variants={lineVariants}
                  style={{ originX: 0 }}
                />
                <div className="w-36"></div>
                <motion.div 
                  className="flex-1 h-px border-t-2 border-dashed border-gray-400"
                  variants={lineVariants}
                  style={{ originX: 0 }}
                />
              </div>
            </div>
            
            {steps.slice(0, 3).map((step, index) => (
              <motion.div 
                key={step.num} 
                className="flex flex-col items-center text-center relative z-10"
                variants={stepVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                {/* Icon */}
                <motion.div 
                  className="w-18 h-18 mb-4 flex items-center justify-center rounded-2xl shadow-lg"
                  style={{
                    background: 'linear-gradient(135deg, #FF9B73 0%, #FF7B47 100%)',
                    boxShadow: '0 4px 16px rgba(255, 123, 71, 0.3)'
                  }}
                  variants={iconVariants}
                  whileHover={{ 
                    scale: 1.1,
                    rotate: 5,
                    transition: { duration: 0.2 }
                  }}
                >
                  {step.icon}
                </motion.div>

                {/* Step Number and Title */}
                <motion.h3 
                  className="font-semibold text-gray-900 mb-2"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 + (index * 0.1) }}
                  viewport={{ once: true }}
                >
                  {step.num}. {step.title}
                </motion.h3>

                {/* Description */}
                <motion.p 
                  className="text-sm text-gray-600 leading-relaxed max-w-48"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 + (index * 0.1) }}
                  viewport={{ once: true }}
                >
                  {step.description.split('"').map((part, i) => 
                    i % 2 === 1 ? (
                      <span key={i} className="font-medium text-gray-800">"{part}"</span>
                    ) : (
                      <span key={i}>{part}</span>
                    )
                  )}
                </motion.p>
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom Row - 2 steps with connecting line for large screens */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 sm:gap-8 gap-14 max-w-2xl mx-auto relative"
            variants={containerVariants}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.2 }}
          >
            {/* Connecting line for bottom row */}
            <div className="hidden md:block absolute top-9 left-0 w-full h-px z-0">
              <div className="flex justify-center items-center h-full px-24">
                <motion.div 
                  className="w-[200px] h-px border-t-2 border-dashed border-gray-400"
                  variants={lineVariants}
                  style={{ originX: 0 }}
                />
              </div>
            </div>
            
            {steps.slice(3, 5).map((step, index) => (
              <motion.div 
                key={step.num} 
                className="flex flex-col items-center text-center relative z-10"
                variants={stepVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                {/* Icon */}
                <motion.div 
                  className="w-18 h-18 mb-4 flex items-center justify-center rounded-2xl shadow-lg"
                  style={{
                    background: 'linear-gradient(135deg, #FF9B73 0%, #FF7B47 100%)',
                    boxShadow: '0 4px 16px rgba(255, 123, 71, 0.3)'
                  }}
                  variants={iconVariants}
                  whileHover={{ 
                    scale: 1.1,
                    rotate: 5,
                    transition: { duration: 0.2 }
                  }}
                >
                  {step.icon}
                </motion.div>

                {/* Step Number and Title */}
                <motion.h3 
                  className="font-semibold text-gray-900 mb-2"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 + (index * 0.1) }}
                  viewport={{ once: true }}
                >
                  {step.num}. {step.title}
                </motion.h3>

                {/* Description */}
                <motion.p 
                  className="text-sm text-gray-600 leading-relaxed max-w-48"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 + (index * 0.1) }}
                  viewport={{ once: true }}
                >
                  {step.description.split('"').map((part, i) => 
                    i % 2 === 1 ? (
                      <span key={i} className="font-medium text-gray-800">"{part}"</span>
                    ) : (
                      <span key={i}>{part}</span>
                    )
                  )}
                </motion.p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;