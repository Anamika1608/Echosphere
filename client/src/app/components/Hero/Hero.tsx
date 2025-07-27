import { Button } from '../../../components/ui/button';
import { Link } from 'react-router-dom';
import HeroGradient from '../../../assets/HeroGradient.svg'
import Spline from '@splinetool/react-spline';

const Hero = () => {
    return (
        <section id="hero" className="container mx-auto px-0 pb-16 text-center">
            <div className=" absolute inset-[-10] sm:inset-0" style={{ display: 'inline-flex', padding: '', flexDirection: 'column', alignItems: 'center' }}>
                <img src={HeroGradient} alt="Hero Gradient" className="w-full h-full object-cover" />
            </div>
            <div className="relative inline-block pt-20">
                <h1 className="text-5xl leading-tight md:text-6xl lg:text-7xl font-bold tracking-tighter max-w-xl sm:max-w-full mx-auto sm:mx-0">
                    Community Manager{' '}
                    <span className="text-[#FF4500] font-normal tracking-wide text-5xl md:text-7xl lg:text-8xl" style={{ fontFamily: '"Comic Sans MS", "Chalkboard SE", cursive' }}>
                        AI
                    </span>
                </h1>
            </div>
            <p className="max-w-xl mt-6 mx-10 text-base md:text-lg text-slate-600 pb-5">
                A faster approach to Residential Community problems. Making support instant and community building effortless.
            </p>
            <div className='flex justify-center align-items-center mx-auto' style={{ width: '123px', height: '123px', flexShrink: 0 }}>
                <Spline
        scene="../../../../../public/spline.spline" 
      />
            </div>

            <div className="mt-5 flex flex-row sm:flex-row items-center justify-center gap-4">
                <Button size="default" className="bg-[#FF4500] hover:bg-[#E03E00] text-white  sm:w-auto" asChild>
                    <Link to="/register">Voice assistant</Link>
                </Button>
                <Button size="default" className="bg-orange-100 hover:bg-[#E03E00] hover:text-white text-[#FF4500]  sm:w-auto" asChild>
                    <Link to="/register">Login here</Link>
                </Button>

            </div>
            
        </section>
    );
}

export default Hero;