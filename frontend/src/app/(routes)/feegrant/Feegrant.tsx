"use client";
import React, { useState } from "react";
import Image from "next/image";
import CustomTabsGroup, { TabPanel } from "staking/components/CustomTabsGroup";
import { useForm } from "react-hook-form";
import NewBasicGrant from "../../../components/NewBasicGrant";
import GrantsByMeTable from "../../../components/GrantsByMeTable";
import GrantsToMeTable from "../../../components/GrantsToMeTable";

export default function Feegrant() {
  const [tab, setTab] = useState(0);
  const [feegrantTypeTab, setFeegrantTypeTab] = useState(0);

  const date = new Date();
  const expiration = new Date(date.setTime(date.getTime() + 365 * 86400000));

  const handleTabChange = (value: number) => {
    setTab(value);
  };

  const handleFeegrantTypeTabChange = (value: number) => {
    setFeegrantTypeTab(value);
  };

  const methods = useForm({
    defaultValues: {
      grantee: "",
      spendLimit: 0,
      expiration: expiration,
      period: 1,
      periodSpendLimit: 0,
    },
  });

  return (
    <>
      <div className="w-full flex justify-center">
        <CustomTabsGroup
          handleTabChange={handleTabChange}
          tabs={[
            { title: "Granted By Me", disabled: false },
            { title: "Create new Grant", disabled: false },
            { title: "Granted To Me", disabled: false },
          ]}
        />
      </div>
      <div className="mt-10">
        <TabPanel value={tab} index={0}>
          <GrantsByMeTable />
        </TabPanel>
        <TabPanel value={tab} index={1}>
          <div className="flex justify-between items-center">
            <h2 className="text-[20px] leading-3 font-bold">
              Create New Grant
            </h2>
            <div className="px-6 gap-[10px] flex items-center rounded-[100px] bg-[#483D4F] h-10">
              <Image
                src="./alert-icon.svg"
                height={24}
                width={24}
                alt="Alert"
              />
              <p className="text-[12px] leading-[14px] font-bold">
                Feegrant does not support ledger signing, transactions through
                ledger will fail.{" "}
              </p>
            </div>
          </div>
          <div className="flex justify-center mt-10">
            <CustomTabsGroup
              handleTabChange={handleFeegrantTypeTabChange}
              tabs={[
                { title: "Basic", disabled: false },
                { title: "Periodic", disabled: false },
              ]}
            />
          </div>
          <div className="mt-10">
            <TabPanel value={feegrantTypeTab} index={0}>
              <NewBasicGrant />
            </TabPanel>
            <TabPanel value={feegrantTypeTab} index={1}>
              Periodic
            </TabPanel>
          </div>
        </TabPanel>
        <TabPanel value={tab} index={2}>
          <GrantsToMeTable />
        </TabPanel>
      </div>
    </>
  );
}
