"use client";
import React, { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import CustomTabsGroup, { TabPanel } from "../CustomTabsGroup";
import AllMultisigAccount from "staking/app/(routes)/multisig/AllMultisigAccount";
import RecentTable from "staking/app/(routes)/multisig/RecentTable";
import AllMultisiggrid from "staking/app/(routes)/multisig/AllMultisiggrid";
import AllNetworksTable from "staking/app/(routes)/multisig/AllNetworksTable";
import TransactionsTable from "staking/app/(routes)/multisig/TransactionsTable";

export default function Multisig() {
  const [tab, setTab] = useState(0);
  const [multisigTypeTab, setMultisigTypeTab] = useState(0);
  const handleTabChange = (value: number) => {
    setTab(value);
  };
  const handleMultisigTypeTabChange = (value: number) => {
    setMultisigTypeTab(value);
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
          Create new multisig
        </TabPanel>
        <TabPanel value={tab} index={2}>
          <AllMultisiggrid />
          <div className="space-y-6">
            <div className="flex justify-between items-center space-y-10">
              <div className="table-main-text">Transactions</div>
              <button className="updatemembers">Create Transaction</button>
            </div>
            <div className="flex justify-center mt-10">
              <div className="space-y-10">
                <CustomTabsGroup
                  handleTabChange={handleMultisigTypeTabChange}
                  tabs={[
                    { title: "Active", disabled: false },
                    { title: "Completed", disabled: false },
                  ]}
                />
              </div>
            </div>
          </div>
          <TransactionsTable />
        </TabPanel>
      </div>
    </>
  );
}
