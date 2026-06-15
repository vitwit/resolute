import React from 'react';
import TabsGroup from './TabsGroup';

interface SettingsHeaderProps {
  action: () => void;
  actionName: string;
  tabName: string;
}

const SettingsHeader = (props: SettingsHeaderProps) => {
  const { action, actionName, tabName } = props;
  return (
    <div className="space-y-6">
      <div className="text-h1">Settings</div>
      <TabsGroup
        action={action}
        actionName={actionName}
        selectedTab={tabName}
      />
    </div>
  );
};

export default SettingsHeader;
