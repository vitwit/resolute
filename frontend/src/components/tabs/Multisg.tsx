"use client";
import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import CustomTabsGroup, { TabPanel } from "../CustomTabsGroup";
import AllMultisigAccount from "staking/app/(routes)/multisig/AllMultisigAccount";
import RecentTable from "staking/app/(routes)/multisig/RecentTable";


export default function Multisig() {
  const [tab, setTab] = React.useState(0);
  const handleTabChange = (value: number) => {
    setTab(value);
  };
  return (
    <>
      <div className="w-full flex justify-center">
        <CustomTabsGroup
          handleTabChange={handleTabChange}
          tabs={[
            { title: "Recent", disabled: false },
            { title: "Create new Multisig", disabled: false },
            { title: "All Multisig Accounts", disabled: false },
          ]}
        />
      </div>
      <div className="mt-10">
        <TabPanel value={tab} index={0}>
        <RecentTable />
        
        </TabPanel>
        <TabPanel value={tab} index={1}>
          Create new group
        </TabPanel>
        <TabPanel value={tab} index={2}>
          <AllMultisigAccount />
        </TabPanel>
      </div>
    </>
  );
}
