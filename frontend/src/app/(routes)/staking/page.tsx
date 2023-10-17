import React from "react";
import StakingCards from "../../../components/StakingCards";
import StakedAmount from "../../../components/StakedAmount";
import StakedAmountWithActions from "../../../components/StakedAmountWithActions";
import ValidatorsTable from "../../../components/ValidatorsTable";

const page = () => {
  return (
    <div className="page space-y-10">
      <StakedAmountWithActions />
      <div className="topNav__title">
        <h2>My Delegation</h2>
      </div>
      <StakingCards />
      <ValidatorsTable />
    </div>
  );
};

export default page;
