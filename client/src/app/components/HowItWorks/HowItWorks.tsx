import React from 'react';
// import HowItWorksBg from '../../../assets/HowItWorksBg.png';
// import HowItWorks2 from '../../../assets/HowItWorks2.png';
// import Icon1 from '../../../assets/Icon1.svg';
// import Icon2 from '../../../assets/Icon2.svg';
// import Icon3 from '../../../assets/Icon3.svg';
// import Icon4 from '../../../assets/Icon4.svg';
// import Icon5 from '../../../assets/Icon5.svg';

// const steps = [
//   { 
//     num: 1, 
//     title: 'You Talk', 
//     description: 'Resident reports, "My Wi-Fi is down!" into the app.',
//     icon: (
//       <img src={Icon1} alt="Icon 1" className='w-10 h-10'/>
//     )
//   },
//   { 
//     num: 2, 
//     title: 'AI listens', 
//     description: 'The system understands it\'s a "Wi-Fi complaint."',
//     icon: (
//       <img src={Icon2} alt="Icon 1" className='w-10 h-10'/>
//     )
//   },
//   { 
//     num: 3, 
//     title: 'AI acts', 
//     description: 'Instantly "creates a ticket & assigns" the right technician.',
//     icon: (
//       <img src={Icon3} alt="Icon 1" className='w-10 h-10'/>
//     )
//   },
//   { 
//     num: 4, 
//     title: 'Get Reply', 
//     description: 'AI confirms, "Okay, a ticket is created and assigned."',
//     icon: (
//       <img src={Icon4} alt="Icon 1" className='w-10 h-10'/>
//     )
//   },
//   { 
//     num: 5, 
//     title: 'All done', 
//     description: 'The issue is fixed, and the "ticket is automatically closed."',
//     icon: (
//       <img src={Icon5} alt="Icon 1" className='w-10 h-10'/>
//     )
//   },
// ];

// const HowItWorks = () => {
//   return (
    // <section
    //   id="how-it-works"
    //   className="py-16 bg-white sm:py-24 relative"
    // >
    //   {/* Desktop background */}
    //   <div
    //     className="hidden sm:block absolute inset-0 w-full h-full bg-cover bg-center z-0"
    //      style={{ backgroundImage: 'radial-gradient(120.67% 98.47% at 50% 1.53%, #FFEAD6 0%, #FEFEFE 50.96%, #FFF3E0 100%)' }}
    //     aria-hidden="true"
    //   />
    //   {/* Mobile background */}
    //   <div
    //     className="block sm:hidden absolute inset-0 w-full h-full bg-cover bg-center z-0"
    //     style={{ backgroundImage: 'radial-gradient(235.3% 97.37% at 35.43% 3.73%, #FEFEFE 0%, #FFE4C9 53.26%, #FFFAF3 100%)' }}
    //     aria-hidden="true"
    //   />
    //   <div className="container mx-auto px-4 relative z-10">
    //     <div className="text-center mb-16">
    //       <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-gray-900 sm:pb-8">How it works</h2>
    //     </div>
    //     <div className="relative max-w-4xl mx-auto">
    //       {/* Top Row - 3 steps with connecting lines for large screens */}
    //       <div className="grid grid-cols-1 md:grid-cols-3 sm:gap-8 gap-14 mb-14 sm:mb-16 relative">
    //         {/* Connecting lines for top row */}
    //         <div className="hidden md:block absolute top-9 left-0 w-full h-px z-0">
    //           <div className="flex items-center h-full px-50">
    //             <div className="flex-1 h-px border-t-2 border-dashed border-gray-400"></div>
    //             <div className="w-36"></div>
    //             <div className="flex-1 h-px border-t-2 border-dashed border-gray-400"></div>
    //           </div>
    //         </div>
            
    //         {steps.slice(0, 3).map((step) => (
    //           <div key={step.num} className="flex flex-col items-center text-center relative z-10">
    //             {/* Icon */}
    //             <div className="w-18 h-18 mb-4 flex items-center justify-center rounded-2xl shadow-lg"
    //                  style={{
    //                    background: 'linear-gradient(135deg, #FF9B73 0%, #FF7B47 100%)',
    //                    boxShadow: '0 4px 16px rgba(255, 123, 71, 0.3)'
    //                  }}>
    //               {step.icon}
    //             </div>

    //             {/* Step Number and Title */}
    //             <h3 className="font-semibold text-gray-900 mb-2">
    //               {step.num}. {step.title}
    //             </h3>

    //             {/* Description */}
    //             <p className="text-sm text-gray-600 leading-relaxed max-w-48">
    //               {step.description.split('"').map((part, i) => 
    //                 i % 2 === 1 ? (
    //                   <span key={i} className="font-medium text-gray-800">"{part}"</span>
    //                 ) : (
    //                   <span key={i}>{part}</span>
    //                 )
    //               )}
    //             </p>
    //           </div>
    //         ))}
    //       </div>

    //       {/* Bottom Row - 2 steps with connecting line for large screens */}
    //       <div className="grid grid-cols-1 md:grid-cols-2 sm:gap-8 gap-14 max-w-2xl mx-auto relative ">
    //         {/* Connecting line for bottom row */}
    //         <div className="hidden md:block absolute top-9 left-0 w-full h-px z-0">
    //           <div className="flex justify-center items-center h-full px-24">
    //             <div className="w-[200px] h-px border-t-2 border-dashed border-gray-400"></div>
    //           </div>
    //         </div>
            
    //         {steps.slice(3, 5).map((step) => (
    //           <div key={step.num} className="flex flex-col items-center text-center relative z-10">
    //             {/* Icon */}
    //             <div className="w-18 h-18 mb-4 flex items-center justify-center rounded-2xl shadow-lg"
    //                  style={{
    //                    background: 'linear-gradient(135deg, #FF9B73 0%, #FF7B47 100%)',
    //                    boxShadow: '0 4px 16px rgba(255, 123, 71, 0.3)'
    //                  }}>
    //               {step.icon}
    //             </div>

    //             {/* Step Number and Title */}
    //             <h3 className="font-semibold text-gray-900 mb-2">
    //               {step.num}. {step.title}
    //             </h3>

    //             {/* Description */}
    //             <p className="text-sm text-gray-600 leading-relaxed max-w-48">
    //               {step.description.split('"').map((part, i) => 
    //                 i % 2 === 1 ? (
    //                   <span key={i} className="font-medium text-gray-800">"{part}"</span>
    //                 ) : (
    //                   <span key={i}>{part}</span>
    //                 )
    //               )}
    //             </p>
    //           </div>
    //         ))}
    //       </div>
    //     </div>
    //   </div>
    // </section>


//   );
// };
import { Card, CardHeader, CardTitle } from '../../../components/ui/card';
import Icon1 from '../../../assets/Icon1.svg';
import Icon2 from '../../../assets/Icon2.svg';
import Icon3 from '../../../assets/Icon3.svg';
import Icon4 from '../../../assets/Icon4.svg';
import Icon5 from '../../../assets/Icon5.svg';

const freeTierFeatures = [
  {
    icon: Icon1,
    title: (
      <>
        <strong className="font-bold">1.</strong> Resident reports <strong className="font-bold">"My Wi-Fi is down!"</strong> using<strong className="font-bold"> voice assistant.</strong>
      </>
    ),
  },
  {
    icon: Icon2,
    title: (
      <>
        <strong className="font-bold">2.</strong>The <strong className="font-bold">system understands</strong> it's a <strong className="font-bold">WiFi complaint.</strong>
      </>
    ),
  },
  {
    icon: Icon3,
    title: (
      <>
        <strong className="font-bold">3.</strong> Instantly <strong className="font-bold">creates</strong> a ticket & <strong className="font-bold">suggests</strong> the right technician.
      </>
    ),
  },
  {
    icon: Icon4,
    title: (
      <>
        <strong className="font-bold">4.</strong> <strong className="font-bold">AI confirms:</strong> ticket created & assigned. Marks its <strong className="font-bold">priority.</strong>
      </>
    ),
  },
  {
    icon: Icon5,
    title: (
      <>
        <strong className="font-bold">5.</strong> Issue resolved. Ticket is auto-closed with <strong className="font-bold">status update</strong> to the resident.
      </>
    ),
  },
  {
    icon: Icon3,
    title: (
      <>
        <strong className="font-bold">6.</strong> Also suggests <strong className="font-bold">smart</strong>, AI-driven <strong className="font-bold">community events.</strong>
      </>
    ),
  }
];

const HowItWorks = () => {
  return (
    <section
      id="features"
      className="container grid sm:grid-cols-2 sm:gap-6 mx-auto px-6 sm:px-16 py-16 sm:py-24"
      style={{
        backgroundImage:
          'radial-gradient(292.12% 100% at 50% 0%, #F9F7F5 0%, #FFF8F1 21.63%, #FFE4C9 45.15%, #FFE9C9 67.31%,#FFFAF3 100%)',
      }}
    >
      <div className="text-center sm:text-left mb-12 sm:pl-20">
        
        <h2 className="text-3xl sm:text-5xl sm:font-semibold font-bold tracking-tight mt-2 sm:w-[450px] leading-tight">
           How it works 
        </h2>
        <span className="text-sm sm:text-xl font-semibold text-gray-500">SIMPLE STEPS</span>
      </div>

      <div className="grid grid-cols-2 sm:max-w-[600px] sm:gap-8 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        {freeTierFeatures.map(({ icon, title }, index) => (
          <Card
            key={index}
            className="text-left border-transparent rounded-[36px] sm:rounded-[44px] hover:border-[#FF4500] hover:shadow-xl transition-all duration-300 py-4 px-6 min-h-[200px] sm:min-h-auto bg-white"
          >
            <CardHeader className="p-0">
              <div className="pt-2 mb-4">
                <img src={icon} alt={`Feature icon ${index + 1}`} className="w-7 h-7" />
              </div>
              <CardTitle className="text-gray-800 text-left text-base font-light leading-snug sm:mb-4">
                {title}
              </CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
