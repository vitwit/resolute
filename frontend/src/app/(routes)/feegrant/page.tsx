import React from "react";
import Feegrants from "../../../components/tabs/Feegrants";
import GrantsToMeTable from "staking/components/GrantsToMeTable";

const page = () => {
  return (
    <div className="page space-y-10">
      <Feegrants />
      <GrantsToMeTable />
    </div>
  );
};

export default page;
