import React from 'react';

const PageHeader = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div>
      <div className="flex gap-1 flex-col w-full">
        <div className="text-h1">{title}</div>
        <div className="flex flex-col gap-2">
          <div className="text-b1-light">{description}</div>
          <div className="divider-line"></div>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
