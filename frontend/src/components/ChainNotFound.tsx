import React from 'react';
import messages from '@/utils/messages.json';

const ChainNotFound = () => {
  return (
    <div className="w-full h-screen text-white flex justify-center items-center">
      {messages.chainNotFound}
    </div>
  );
};

export default ChainNotFound;
