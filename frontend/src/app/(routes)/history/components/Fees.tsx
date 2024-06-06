import Image from 'next/image';

const fee = '120 AKT';

const Fees = () => {
  return (
    <div className="right-view-grid">
      <div className="flex space-x-2">
        <Image src="/gas.svg" width={24} height={24} alt="Gas-Icon" />
        <p className="text-b1 items-center flex">Fees</p>
      </div>
      <div className="divider-line"></div>
      <div className="text-b1">{fee}</div>
    </div>
  );
};

export default Fees;
