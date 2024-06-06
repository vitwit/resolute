import React from 'react';
import Network from './Network';
import Gas from './Gas';
import Fees from './Fees';
import Memo from './Memo';

const Rightbar = () => {
  return (
    <div className="flex flex-col justify-between px-0 py-10">
      <Network />
      <Gas />
      <Fees />
      <Memo />
    </div>
  );
};

export default Rightbar;
