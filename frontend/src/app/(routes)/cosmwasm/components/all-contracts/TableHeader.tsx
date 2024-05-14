import React from 'react';

const TableHeader = ({ title }: { title: string }) => {
  return (
    <th>
      <div className="min-h-[17px] flex items-center text-sm not-italic font-bold leading-[normal] text-white">
        {title}
      </div>
    </th>
  );
};

export default TableHeader;
