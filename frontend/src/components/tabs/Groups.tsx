"use client";
import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import CustomTabsGroup, { TabPanel } from "../CustomTabsGroup";
import GroupsCards from "../GroupsCards";

export default function Groups() {
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
            { title: "Created By Me", disabled: false },
            { title: "Create new group", disabled: false },
            { title: "Other Groups", disabled: false },
          ]}
        />
      </div>
      <div className="mt-10">
        <TabPanel value={tab} index={0}>
          <GroupsCards />
        </TabPanel>
        <TabPanel value={tab} index={1}>
          Create new group
        </TabPanel>
        <TabPanel value={tab} index={2}>
          Other groups
        </TabPanel>
      </div>
    </>
  );
}
