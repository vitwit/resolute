import React from 'react';

const StakingActionsMenu = () => {
  const actions = ['Delegate', 'Un-Delegate', 'Re-Delegate'];
  return (
    <div className="staking-actions-menu py-4 flex flex-col gap-4">
      {actions.map((action, index) => (
        <div key={index} className="staking-actions-menu-item">
          {action}
        </div>
      ))}
    </div>
  );
};

export default StakingActionsMenu;
