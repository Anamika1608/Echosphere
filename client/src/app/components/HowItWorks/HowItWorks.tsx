import React from 'react';

const steps = [
  { num: 1, title: 'You Talk', description: 'Resident reports, "My Wi-Fi is down!" into the app.' },
  { num: 2, title: 'AI Listens', description: 'The system understands it\'s a "Wi-Fi complaint."' },
  { num: 3, title: 'AI Acts', description: 'Instantly creates a ticket & assigns the right technician.' },
  { num: 4, title: 'Get Reply', description: 'AI confirms, "Okay, a ticket is created and assigned."' },
  { num: 5, title: 'All Done', description: 'The issue is fixed, and the ticket is automatically closed.' },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-16 sm:py-24 bg-slate-50/70">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12"><h2 className="text-3xl sm:text-4xl font-bold tracking-tight">How It Works</h2></div>
        <div className="relative">
          <div className="hidden md:block absolute top-6 left-0 w-full h-px bg-slate-300 border-t border-dashed -z-10" />
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {steps.map((step) => (
              <div key={step.num} className="flex flex-col items-center text-center">
                <div className="w-12 h-12 mb-4 flex items-center justify-center rounded-full bg-white border-2 border-[#FF4500] text-[#FF4500] font-bold text-lg">{step.num}</div>
                <h3 className="font-semibold text-slate-800">{step.title}</h3>
                <p className="text-sm text-slate-500 mt-1">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;