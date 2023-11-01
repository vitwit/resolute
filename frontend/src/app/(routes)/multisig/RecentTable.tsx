import React from "react";
import Image from "next/image";
import AllNetworksTable from "./AllNetworksTable";

const RecentTable = () => {
  return (
    <div className="space-y-10">
      <div className="network">
        <Image src="./akash.svg" height={32} width={32} alt="akash-logo" />
        <div className="network-name">Akash</div>
      </div>
      <table className="custom-table overflow-y-scroll">
        <thead className="custom-table-head">
          <tr className="text-left ">
            <th className="">Messages</th>
            <th className="w-1/6">Signed</th>
            <th className="w-1/6">Status</th>
            <th className="">Actions</th>
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3, 4].map((item, index) => (
            <tr key={index} className="">
              <td className="">
                <div className="">
                  Send 1 ATOM To cosmos1le7vetsh5...6aj5nhf2
                </div>
              </td>
              <td>0/2</td>
              <td>
                <div className="flex gap-2">
                  <Image
                    src="/wait.png"
                    height={24}
                    width={24}
                    alt="Waiting-logo"
                  />
                  <div className="my-auto ">Waiting</div>
                </div>
              </td>
              <td>
                <div className="flex justify-between h-full items-center">
                  <div className="flex gap-2">
                    <Image
                      src="/raw-logo.svg"
                      height={20}
                      width={20}
                      alt="Raw-logo"
                      className="cursor-pointer"
                    />
                    <div className="my-auto ">Raw</div>
                  </div>
                  <button className="custom-btn">Sign</button>
                  <Image
                    src="./DeleteRed.svg"
                    width={40}
                    height={40}
                    alt="Delete-logo"
                    className="cursor-pointer"
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <AllNetworksTable />
    </div>
  );
};

export default RecentTable;
