import React from 'react';

const AddressBookLoading = () => {
  return (
    <div className="flex flex-col items-start p-6">
    <table className="relative w-full">
      <thead className="w-full">
        <tr>
          {['Name', 'Address', ''].map(
            (header, hIndex) => (
              <th key={hIndex} className="">
                <div className="secondary-text items-start flex">
                  {header}
                </div>
              </th>
            )
          )}
        </tr>
      </thead>
      <tbody>
        {Array(3)
          .fill(null)
          .map((_, colIndex) => (
            <tr key={colIndex} className="animate-pulse">
              {Array(3)
                .fill(null)
                .map((_, colIndex) => (
                  <td key={colIndex}>
                    <div className={`h-10  bg-[#252525] rounded my-4 mx-1`}></div>
                  </td>
                ))}
            </tr>
          ))}
      </tbody>
     
    </table>
  </div>
  )
};

export default AddressBookLoading;
