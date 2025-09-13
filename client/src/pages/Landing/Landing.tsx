import { memo, Suspense } from 'react';
import Hero from '../../app/components/Hero/Hero';
import Features from '../../app/components/Features/Features';
import HowItWorks from '../../app/components/HowItWorks/HowItWorks';
import { FAQs } from '../../app/components/FAQs/FAQs';
import Pricing from '@/app/components/Pricing/Pricing';

const LoadingFallback = () => (
  <div className="w-full h-32 bg-gradient-to-r from-orange-100 to-orange-200 animate-pulse rounded-lg flex items-center justify-center">
    <div className="text-orange-600">Loading...</div>
  </div>
);

const Landing = memo(() => {
  return (
    <>
      <Suspense fallback={<LoadingFallback />}>
        <Hero />
      </Suspense>
      <Suspense fallback={<LoadingFallback />}>
        <Features />
      </Suspense>
      <Suspense fallback={<LoadingFallback />}>
        <HowItWorks />
      </Suspense>
      <Suspense fallback={<LoadingFallback />}>
        <Pricing />
      </Suspense>
      <Suspense fallback={<LoadingFallback />}>
        <FAQs />
      </Suspense>
    </>
  );
});

Landing.displayName = 'Landing';

export default Landing;