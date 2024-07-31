import React from 'react';
import SettingsHeader from './components/SettingsHeader';

interface SetttingLayoutProps {
  action: () => void;
  actionName: string;
  tabName: string;
  children: React.ReactNode;
}

const SettingsLayout = (props: SetttingLayoutProps) => {
  const { action, actionName, tabName, children } = props;
  return (
    <div className="mt-10 space-y-10">
      <SettingsHeader
        action={action}
        actionName={actionName}
        tabName={tabName}
      />
      <div>{children}</div>
    </div>
  );
};

export default SettingsLayout;
