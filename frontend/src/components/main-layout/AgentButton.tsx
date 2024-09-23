import { CHAT_ICON } from '@/constants/image-names';
import { useAppDispatch } from '@/custom-hooks/StateHooks';
import { toggleAgentDialog } from '@/store/features/interchain-agent/agentSlice';
import Image from 'next/image';
import React from 'react';

const AgentButton = () => {
  const dispatch = useAppDispatch();

  return (
    <div className="pl-6">
      <button
        onClick={() => {
          dispatch(toggleAgentDialog());
        }}
        className="menu-item font-medium flex justify-between w-full"
      >
        <div className="flex gap-2">
          <Image
            src={CHAT_ICON}
            height={20}
            width={20}
            alt={'Interchain Agent'}
            className="opacity-60"
          />
          <div className="menu-item-name">Interchain Agent</div>
          <div className="solid-btn px-3 py-1 text-[10px] font-medium">New</div>
        </div>
      </button>
    </div>
  );
};

export default AgentButton;
