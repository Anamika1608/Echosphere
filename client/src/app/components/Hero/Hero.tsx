import { Button } from '../../../components/ui/button';
import { Link } from 'react-router-dom';
import TopGradient from '../../../assets/TopGradient.png';
import TopGradient2 from '../../../assets/TopGradient2.png';
import Spline from '@splinetool/react-spline';

const Hero = () => {
    return (
        <section id="hero" className="container mx-auto px-0 pb-16 text-center">

            <div className="sm:inset-0 z-0" style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', overflow: 'hidden' }}>
                <img
                    src={TopGradient}
                    alt="Hero Gradient Small"
                    className="block md:hidden w-full h-full object-cover "
                />
                <img
                    src={TopGradient2}
                    alt="Hero Gradient Large"
                    className="hidden md:block w-full h-full object-cover"
                />
            </div>


            <div className="relative z-10 mt-[-80px] sm:mt-[-160px]">
                <h1 className="text-5xl leading-tight  md:text-6xl lg:text-7xl font-bold tracking-tighter max-w-xl sm:max-w-full mx-auto sm:mx-0">
                    Community Manager{' '}
                    <span className="text-[#FF6D2E] font-normal tracking-wide text-5xl md:text-7xl lg:text-8xl" style={{ fontFamily: '"Comic Sans MS", "Chalkboard SE", cursive' }}>
                        AI
                    </span>
                </h1>
                <p className="mt-4 text-gray-500 max-w-[500px] mx-8 sm:mx-auto font-light">
                    A faster approach to <strong className='font-bold'>Residential Community</strong> problems. Making <strong className='font-bold'>support instant</strong> and community building effortless.
                </p>

                <div className="flex justify-center items-center h-[160px] sm:h-[223px] mt-6 mx-auto relative">
  <Spline scene="../../../../../public/spline.spline" />
  
  {/* Overlay div to disable interaction */}
  <div className="absolute inset-0 z-10" style={{ cursor: 'default' }}></div>
</div>
                <div className="mt-8 flex flex-row sm:flex-row items-center justify-center gap-4 sm:mt-10">
                    <Button size="lg" className="bg-[#FF6D2E] hover:bg-[#E03E00] text-white sm:w-auto" asChild>
                        <Link to="/register">Voice assistant</Link>
                    </Button>
                    <Button size="lg" className="bg-orange-100 hover:bg-[#E03E00] hover:text-white text-[#FF6D2E] sm:w-auto" asChild>
                        <Link to="/register">Start for free</Link>
                    </Button>
                </div>

            </div>
        </section>
    );
};

export default Hero;
