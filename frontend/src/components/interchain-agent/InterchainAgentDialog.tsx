import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { toggleAgentDialog } from '@/store/features/interchain-agent/agentSlice';
import React, { useEffect, useState } from 'react';
import AgentSidebar from './AgentSidebar';
import ChatComponent from './ChatComponent';

const InterchainAgentDialog = () => {
  const dispatch = useAppDispatch();
  const agentDialogOpen = useAppSelector((state) => state.agent.agentOpen);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (agentDialogOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [agentDialogOpen]);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const toggleAgent = () => {
    dispatch(toggleAgentDialog());
  };

  if (!agentDialogOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 flex justify-center items-center p-10 bg-[#09090ACC] z-[99999999]"
      onClick={() => dispatch(toggleAgentDialog())}
    >
      <div
        className="bg-[#1C1C1D] h-[750px] max-h-[calc(100vh-80px)] w-full max-w-[1200px] rounded-3xl overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex w-full h-full">
          <AgentSidebar sidebarOpen={sidebarOpen} />
          <ChatComponent
            toggleSidebar={toggleSidebar}
            sidebarOpen={sidebarOpen}
            toggleAgent={toggleAgent}
          />
        </div>
      </div>
    </div>
  );
};

export default InterchainAgentDialog;
