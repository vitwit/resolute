import React from 'react';

const TableHeader = ({ title }: { title: string }) => {
  return (
    <th className="px-6">
      <div className="min-h-[17px] flex items-center text-sm not-italic font-extralight leading-[normal] text-[#ffffff80]">
        {title}
      </div>
    </th>
  );
};

export default TableHeader;
