import React from 'react';

const TableHeader = ({ title }: { title: string }) => {
  return (
    <th>
      <div className="min-h-[17px] flex items-center text-sm not-italic font-normal leading-[normal]">
        {title}
      </div>
    </th>
  );
};

export default TableHeader;
