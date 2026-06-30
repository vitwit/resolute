import React from 'react';

const TxnInfoCard = ({
  children,
  name,
}: {
  name: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="txn-data">
      <div className="text-small">{name}</div>
      <div className="flex items-center gap-1 text-b1">{children}</div>
    </div>
  );
};

export default TxnInfoCard;
