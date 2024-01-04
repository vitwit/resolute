import React from 'react';

const StakingActionsMenu = ({
  handleMenuAction,
}: {
  handleMenuAction: (type: string) => void;
}) => {
  const actions = ['Undelegate', 'Redelegate'];
  return (
    <div className="staking-actions-menu py-4 flex flex-col gap-2">
      <div
        className=" block md:hidden staking-actions-menu-item"
        onClick={() => handleMenuAction('delegate')}
      >
        Delegate
      </div>
      {actions.map((action, index) => (
        <div
          key={index}
          className="staking-actions-menu-item"
          onClick={() => handleMenuAction(action.toLowerCase())}
        >
          {action}
        </div>
      ))}
    </div>
  );
};

export default StakingActionsMenu;
