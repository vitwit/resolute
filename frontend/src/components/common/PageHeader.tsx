import React from 'react';

const PageHeader = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div className="space-y-2">
      <div className="text-h1">{title}</div>
      <div className="text-b1-light">{description}</div>
      <div className="divider-line"></div>
    </div>
  );
};

export default PageHeader;
