// import React from 'react';
// import { Card, CardHeader, CardTitle } from '../../../components/ui/card';
// import { Mic, LayoutDashboard, Lightbulb, Bell } from 'lucide-react';

// const freeTierFeatures = [
//   {
//     icon: Mic,
//     title: (
//       <>
//         <strong className='font-bold'>Instantly create</strong> tickets by simply <strong className='font-bold'>speaking</strong> your issue.
//       </>
//     ),
//     bg: "radial-gradient(75.62% 84.8% at 12.72% 9.66%, #FFF0E9 0%, #FFE9C8 48.08%, #FFFBF9 100%)"
//   },
//   {
//     icon: LayoutDashboard,
//     title: (
//       <>
//         <strong className='font-bold'>Track</strong> issue statuses and community updates from your <strong className='font-bold'>Dashboard</strong>.
//       </>
//     ),
//     bg: "radial-gradient(75.62% 84.8% at 12.72% 9.66%, #FFF0E9 0%, #FFE9C8 48.08%, #FFFBF9 100%)"
//   },
//   {
//     icon: Lightbulb,
//     title: (
//       <>
//         Get <strong className='font-bold'>smart</strong>, AI ideas for engaging <strong className='font-bold'>community events</strong>.
//       </>
//     ),
//     bg: "radial-gradient(74.92% 85.52% at 94.97% 100%, #FFF0E9 0%, #FFE9C8 48.08%, #FFFBF9 100%)"
//   },
//   {
//     icon: Bell,
//     title: (
//       <>
//         Never miss a <strong className='font-bold'>high-priority issue</strong> with instant <strong className='font-bold'>auto-alerts</strong>.
//       </>
//     ),
//     bg: "radial-gradient(74.92% 85.52% at 94.97% 100%, #FFF0E9 0%, #FFE9C8 48.08%, #FFFBF9 100%)"
//   }
// ];

// const Features: React.FC = () => {
//   return (
//     <section id="features" className="container mx-auto px-4 py-16 sm:py-24">
//       <div className="text-center mb-12">
//         <span className="text-sm font-semibold text-[#FF4500]">FREE-TIER FEATURES</span>
//         <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mt-2">
//           All The Essentials, For Free
//         </h2>
//       </div>

//       <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//         {freeTierFeatures.map(({ icon: Icon, title, bg }, index) => (
//           <Card
//             key={index}
//             className="text-left border-transparent hover:border-[#FF4500] hover:shadow-xl transition-all duration-300 py-4 px-6 min-h-[200px]"
//             style={{
//               backgroundImage: bg,
//               backgroundColor: "#fff",
//             }}
//           >
//             <CardHeader className="p-0">
//               <div className="w-fit pt-2 mb-4">
//                 <Icon className="w-8 h-8 sm:w-8 sm:h-8 text-[#FF4500]" />
//               </div>
//               <CardTitle className="text-gray-800 text-left text-base font-light leading-snug">
//                 {title}
//               </CardTitle>
//             </CardHeader>
//           </Card>
//         ))}
//       </div>
//     </section>
//   );
// };

// export default Features;
import React from 'react';
import { Card, CardHeader, CardTitle } from '../../../components/ui/card';
import { Mic, LayoutDashboard, Lightbulb, Bell } from 'lucide-react';

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
  return (
    <section id="features" className="container grid sm:grid-cols-2 sm:gap-6 mx-auto px-4 sm:px-16 py-16 sm:py-24" style={{ backgroundImage: 'radial-gradient(292.12% 100% at 50% 0%, #F9F7F5 0%, #FFF8F1 21.63%, #FFE4C9 45.15%, #FFE9C9 67.31%,#FFFAF3 100%)' }}>
      <div className="text-center sm:text-left mb-12 sm:pl-20">
        <span className="text-sm sm:text-xl font-semibold text-gray-500">FREE-TIER FEATURES</span>
        <h2 className="text-3xl sm:text-5xl sm:font-semibold font-bold tracking-tight mt-2 sm:w-[450px] leading-tight">
          All The Essentials, <span className="text-[#FF4500]">For Free</span>
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:max-w-[600px] sm:gap-8 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        {freeTierFeatures.map(({ icon: Icon, title }, index) => (
          <Card
            key={index}
            className="text-left border-transparent rounded-[32px] sm:rounded-[44px] hover:border-[#FF4500] hover:shadow-xl transition-all duration-300 py-4 px-6 min-h-[200px] sm:min-h-auto "
            style={{
              backgroundColor: "#fff",
            }}
          >
            <CardHeader className="p-0">
              <div className="w-fit pt-2 mb-4">
                <Icon className="w-8 h-8 sm:w-8 sm:h-8 text-[#FF4500]" />
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

export default Features;
