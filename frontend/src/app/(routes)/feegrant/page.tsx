import React from "react";
import Feegrants from "../../../components/tabs/Feegrants";
import GrantsToMeTable from "staking/components/GrantsToMeTable";
import GrantsByMeTable from "staking/components/GrantsByMeTable";

const page = () => {
  return (
    <div className="page space-y-10">
      <Feegrants />
    </div>
  );
};

export default page;
