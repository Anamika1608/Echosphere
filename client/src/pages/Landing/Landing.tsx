import  Hero  from '../../app/components/Hero/Hero';
import  Features  from '../../app/components/Features/Features';
import  HowItWorks  from '../../app/components/HowItWorks/HowItWorks';
import  {FAQs}  from '../../app/components/FAQs/FAQs';

export default function Landing() {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <FAQs />
    </>
  );
}