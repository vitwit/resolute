import Image from 'next/image';
import React from 'react';

const ChatSuggestions = () => {
  return (
    <div className="h-full flex items-end justify-center gap-10">
      <SendSuggestion />
      <IBCSuggestion />
      <DelegateSuggestion />
    </div>
  );
};

export default ChatSuggestions;

const SendSuggestion = () => {
  return (
    <div className="w-1/4 h-[160px]  border border-white/20 rounded-2xl p-4 space-y-4 cursor-pointer hover:bg-white/10">
      <div className="flex items-center space-x-2">
        <Image
          className="bg-white/10 rounded p-2"
          src="/sidebar-menu-icons/transfers-icon.svg"
          width={32}
          height={32}
          alt="Staking Icon"
        />
        <span className="text-white">Send Txn</span>
      </div>

      <p className="text-gray-500">send 1 ATOM to cosmos....</p>
    </div>
  );
};

const DelegateSuggestion = () => {
  return (
    <div className="w-1/4 h-[160px]  border border-white/20 rounded-2xl p-4 space-y-4 cursor-pointer hover:bg-white/10">
      <div className="flex items-center space-x-2">
        <Image
          className="bg-white/10 rounded p-2"
          src="/sidebar-menu-icons/staking-icon.svg"
          width={32}
          height={32}
          alt="Staking Icon"
        />
        <span className="text-white">Delegate Txn</span>
      </div>

      <p className="text-gray-500">delegate 1 ATOM to cosmosvaloper....</p>
    </div>
  );
};

const IBCSuggestion = () => {
  return (
    <div className="w-1/4 h-[160px] border border-white/20 rounded-2xl p-4 space-y-4 cursor-pointer hover:bg-white/10">
      <div className="flex items-center space-x-2">
        <Image
          className="bg-white/10 rounded p-2"
          src="/sidebar-menu-icons/transfers-icon.svg"
          width={32}
          height={32}
          alt="Staking Icon"
        />
        <span>IBC Txn</span>
      </div>

      <p className="text-gray-500">send 1 ATOM to cosmos.... from chainID</p>
    </div>
  );
};
