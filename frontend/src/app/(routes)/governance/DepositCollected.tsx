const DepositCollected = () => {
  return (
    <>
      <div className="flex flex-col gap-6 p-6 rounded-2xl bg-[#FFFFFF05] w-[330px]">
        <div className="flex flex-col gap-2">
          <p className="text-b1">Deposit Collected</p>
          <div className="divider-line"></div>
        </div>
        <div className="flex flex-col space-y-2 justify-center items-center">
          <p className="text-h2 font-bold">1500 / 5000 AKT</p>
          <p className="secondary-text">25% deposit collected</p>
        </div>
        <div className="bg-[#FFFFFF0D] w-full h-[10px] rounded-full">
          <div className="bg-[#f0f0f3] h-[10px] w-[4px] absolute  flex left-[224px]"></div>
          <div
            style={{ width: 80 }}
            className={`yes-bg h-2 rounded-l-full `}
          ></div>
        </div>
      </div>
    </>
  );
};
export default DepositCollected;
