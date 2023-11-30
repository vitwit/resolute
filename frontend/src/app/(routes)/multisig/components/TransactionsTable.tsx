import React from 'react';
import Image from 'next/image';

const TransactionsTable = () => {
  return (
    <div className="space-y-10">
      <table className="custom-table">
        <thead className="custom-table-head">
          <tr className="text-left">
            <th className=''>Messages</th>
            <th className="">Signed</th>
            <th className="">Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3, 4,5,6].map((item, index) => (
            <tr key={index}>
              <td>
                <div className="space-y-1">
                  <div className=''>Send 1 ATOM To</div>
                  <div className=''>cosmos1le7vetsh5...</div>
                </div>
              </td>
              <td className=''>0/2</td>
              <td>
                <div className="">Waiting</div>
              </td>
              <td>
                <div className="flex justify-between h-full items-center">
                  <div className="relative image-style justify-center flex">
                    <Image
                      src="/raw-icon.svg"
                      height={14}
                      width={14}
                      alt="Raw-Icon"
                      className="cursor-pointer"
                    />

                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-[4px] font-medium">
                      RAW
                    </div>
                  </div>

                  <div className="image-style justify-center flex">
                    <Image
                      src="/sign-icon.svg"
                      height={14}
                      width={14}
                      alt="Signature"
                      className="cursor-pointer"
                    />
                  </div>
                  <div className="image-style justify-center flex">
                    <Image
                      src="./delete-icon.svg"
                      width={14}
                      height={14}
                      alt="Delete-Icon"
                      className="cursor-pointer"
                    />
                  </div>
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
