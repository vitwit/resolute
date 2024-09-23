import Image from 'next/image';
import React from 'react';

const ChatSuggestions = () => {
  return (
    <div className="h-full flex items-end justify-center gap-10">
      {[1, 2, 3].map((index) => (
        <Suggestion key={index} />
      ))}
    </div>
  );
};

export default ChatSuggestions;

const Suggestion = () => {
  return (
    <div className="w-[25%] border-[#FFFFFF29] border-[1px] rounded-2xl p-4 space-y-4 cursor-pointer hover:bg-[#ffffff0d]">
      <Image
        className="bg-[#ffffff14] rounded p-2"
        src="/interchain-agent/hub-icon.svg"
        width={32}
        height={32}
        alt=""
      />
      <div>Lorem ipsum dolor sit amet consectetur, adipisicing elit.</div>
    </div>
  );
};
