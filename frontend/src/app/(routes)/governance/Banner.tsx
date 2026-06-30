import './style.css';
import Image from 'next/image';

const Banner = () => {
  return (
    <div className="fixed w-full bg-[#ffc13c] gap-2 px-6 py-3 flex items-center">
      <Image
        src="/infoblack.svg"
        width={24}
        height={24}
        alt="info-icon"
        draggable={false}
      />
      <p className="text-[#1C1C1D] text-b1 font-semibold ">Important</p>
      <p className="text-[#1C1C1D] text-b1">Voting ends in 03 Days</p>
    </div>
  );
};
export default Banner;
