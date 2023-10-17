import Image from "next/image";
import React from "react";

const AssetsTable = () => {
  return (
    <div>
      <table className="customTable overflow-y-scroll">
        <thead className="customTableHead">
          <tr className="text-left">
            <th className="w-1/4">Network</th>
            <th className="w-1/5">StakeAmount</th>
            <th className="w-1/6">Rewards</th>
            <th className="w-1/6">Price</th>
            <th className="">Actions</th>
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, index) => (
            <tr key={index} className="">
              <td className="flex gap-2">
                <div className="bg-[#3C3047] rounded-full h-[54px] w-[54px] flex justify-center items-center">
                  <Image
                    src="./osmosis-logo.svg"
                    height={42}
                    width={42}
                    alt="osmosis-logo"
                  />
                </div>
                <div className="my-auto font-bold">1.23 OSMO</div>
              </td>
              <td>2 OSMO</td>
              <td>0.3 OSMO</td>
              <td>
                <span  className="font-bold">$ 2.2</span>
                <span className="pl-2 pr-1">
                  <Image
                    className="inline"
                    src="./downarrow-filled.svg"
                    width={16}
                    height={16}
                    alt="Price drop"
                  />
                </span>
                <span className="text-[#E57575] font-semibold">3.5%</span>
              </td>
              <td className="flex justify-between">
                <button className="customBtn">Claim</button>
                <button className="customBtn customBtnDisabled">
                  Claim & Stake
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssetsTable;
