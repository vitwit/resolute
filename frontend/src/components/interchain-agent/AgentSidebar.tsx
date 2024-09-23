import Image from 'next/image';
import React from 'react';

interface AgentSidebarProps {
  sidebarOpen: boolean;
}

const AgentSidebar = ({ sidebarOpen }: AgentSidebarProps) => {
  return (
    <div
      className={`h-full bg-[#09090A66] transition-all duration-100 ease-in-out ${
        sidebarOpen ? 'w-[300px] p-10 pb-6' : 'w-0 p-0'
      }`}
    >
      {sidebarOpen && (
        <div className="opacity-100 transition-opacity duration-500 flex flex-col h-full gap-6">
          <div className="flex items-center justify-between">
            <div className="text-white font-bold text-[18px]">Chats</div>
            <Image
              src={'/interchain-agent/solid-add-icon.svg'}
              width={32}
              height={32}
              alt=""
            />
          </div>
          <div className="flex-1">Chat history</div>
          <div className="border-t-[1px] border-[#ffffff29] pt-2">
            <button className="py-[10px] px-2 flex items-center gap-2">
              <Image
                src="/interchain-agent/export-icon.svg"
                height={20}
                width={20}
                alt=""
              />
              <div className="text-[14px] font-thin">Export conversation</div>
            </button>
            <button className="py-[10px] px-2 flex items-center gap-2">
              <Image
                src="interchain-agent/delete-icon.svg"
                height={20}
                width={20}
                alt=""
              />
              <div className="text-[14px] font-thin">Delete conversation</div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentSidebar;
