import  Mic  from "../../assets/Mic.svg";

const PastelOrb = () => {
  return (
    <div className="w-[100px] h-[100px] rounded-full animate-float animate-glowPulse relative bg-[radial-gradient(circle_at_50%_50%,#FFB4A5,#FFDAC1,#ffd9b3,#ffecd2)] shadow-[0_0_40px_rgba(255,191,128,0.4),0_0_80px_rgba(255,144,160,0.3)] blur-[0.2px]">
        <img src={Mic} alt="Mic" className="absolute inset-0 m-auto w-1/3 h-2/3" />
    </div>
  );
};

export default PastelOrb;