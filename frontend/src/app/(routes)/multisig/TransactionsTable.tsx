"use client";
import React, { useState } from "react";
import Image from "next/image";

const TransactionsTable = () => {
  const [transactions, setTransactions] = useState([1, 2, 3, 4, 5, 6]);

  return (
    <div className="space-y-10 mt-10">
      <table className="custom-table overflow-y-scroll">
        <thead className="custom-table-head">
          <tr className="text-left">
            <th className="">Messages</th>
            <th className="w-1/6">Signed</th>
            <th className="w-1/6">Status</th>
            <th className="">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((item, index) => (
            <tr key={index} className="">
              <td className="">
                <div className="flex gap-1 items-center">
                  <div className="">
                    Send 1 ATOM To cosmos1le7vetsh5...6aj5nhf2
                  </div>
                  {index === 1 || index === 3 ? (
                    <Image
                      src="./down-arrow-icon.svg"
                      width={24}
                      height={24}
                      alt="Dropdown"
                    />
                  ) : null}
                </div>
              </td>
              <td>
                {index === 1 || index === 3
                  ? "2/2"
                  : index === 5
                  ? "1/2"
                  : "0/2"}
              </td>
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
                    />
                    <div className="my-auto ">Raw</div>
                  </div>
                  {index === 1 || index === 3 ? (
                    <button className="custom-btn">Broadcast</button>
                  ) : (
                    <button className="custom-btn">Sign</button>
                  )}
                  {index === 6}
                  <Image
                    src="./DeleteRed.svg"
                    width={40}
                    height={40}
                    alt="Delete-logo"
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsTable;
