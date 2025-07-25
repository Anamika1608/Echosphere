import { Button } from '../../../components/ui/button';
import { Link } from 'react-router-dom';

const Hero = () => {
    return (
        <section id="hero" className="container mx-auto px-4 pt-20 pb-16 text-center">
            <div className="relative inline-block">
                <h1 className="text-4xl leading-tight md:text-6xl lg:text-7xl font-bold tracking-tighter max-w-4xl mx-auto">
                    Community Manager{' '}
                    <span className="text-[#FF4500] font-normal tracking-wide text-5xl md:text-7xl lg:text-8xl" style={{ fontFamily: '"Comic Sans MS", "Chalkboard SE", cursive' }}>
                        AI
                    </span>
                </h1>
            </div>
            <p className="max-w-2xl mx-auto mt-6 text-base md:text-lg text-slate-600">
                A faster approach to Residential Community problems. Making support instant and community building effortless.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="bg-[#FF4500] hover:bg-[#E03E00] text-white  sm:w-auto" asChild>
                    <Link to="/register">Get Started Free</Link>
                </Button>
            </div>
        </section>
    );
}

export default Hero;