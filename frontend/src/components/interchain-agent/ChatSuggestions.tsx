import Image from 'next/image';
import React from 'react';

const SUGGESTIONS = [
  {
    title: 'Send Txn',
    text: 'send 1 ATOM to cosmos....',
    icon: '/sidebar-menu-icons/transfers-icon.svg',
  },
  {
    title: 'Delegate Txn',
    text: 'delegate 1 ATOM to cosmosvaloper....',
    icon: '/sidebar-menu-icons/staking-icon.svg',
  },
  {
    title: 'IBC Send Txn',
    text: 'send 1 ATOM to cosmos.... from chainID',
    icon: '/sidebar-menu-icons/transfers-icon.svg',
  },
];

const ChatSuggestions = ({
  handleInputChange,
}: {
  handleInputChange: (value: string) => void;
}) => {
  return (
    <div className="h-full flex items-end justify-center gap-10">
      {SUGGESTIONS.map((suggestion, index) => (
        <Suggestion
          key={index}
          {...suggestion}
          handleInputChange={handleInputChange}
        />
      ))}
    </div>
  );
};

export default ChatSuggestions;

const Suggestion = ({
  title,
  text,
  icon = '/interchain-agent/hub-icon.svg',
  handleInputChange,
}: {
  title?: string;
  text: string;
  icon?: string;
  handleInputChange: (value: string) => void;
}) => {
  return (
    <div
      onClick={() => handleInputChange(text)}
      className="w-1/4 h-[160px]  border border-white/20 rounded-2xl p-4 space-y-4 cursor-pointer hover:bg-white/5"
    >
      <div className="flex items-center space-x-2">
        <Image
          className="bg-white/10 rounded p-2"
          src={icon}
          width={32}
          height={32}
          alt=""
        />
        {title && <span className="text-white">{title}</span>}
      </div>

      <p className="font-extralight text-left">{text}</p>
    </div>
  );
};
