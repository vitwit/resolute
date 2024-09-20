import React from 'react';

const SectionHeader = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div className="space-y-2">
      <div className="space-y-1">
        <div className="text-h2">{title}</div>
        <div className="text-b1-light">{description}</div>
      </div>
      <div className="divider-line"></div>
    </div>
  );
};

export default SectionHeader;
