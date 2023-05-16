import React from "react";
import { Button, Box } from "@mui/material";
import { useForm } from "react-hook-form";
import CreateGroupPolicy from "../../pages/group/CreateGroupPolicy";
import { useDispatch, useSelector } from "react-redux";

function PolicyForm({ handlePolicy, policyObj, handlePolicyClose }) {
  const groupMembersInfo = useSelector(
    (state) => state.group.groupMembers.members
  );
  let groupMembers = [];
  for (let index in groupMembersInfo) {
    groupMembers.push(groupMembersInfo[index].member);
  }

  var policyInitialObj = {
    name: "",
    description: "",
    decisionPolicy: "",
    threshold: 0,
    percentage: 1,
    votingPeriod: "",
    minExecPeriod: 0,
    policyAsAdmin: false,
  };

  if (policyObj) {
    policyInitialObj = {
      decisionPolicy:
        policyObj?.decision_policy?.["@type"] ===
        "/cosmos.group.v1.ThresholdDecisionPolicy"
          ? "threshold"
          : "percentage",
      threshold: Number(policyObj?.decision_policy?.threshold || 0),
      percentage: Number(policyObj?.decision_policy?.percentage * 100 || 1),
      votingPeriod:
        parseFloat(policyObj?.decision_policy?.windows?.voting_period || 0) /
        (24 * 60 * 60),
      minExecPeriod:
        parseFloat(
          policyObj?.decision_policy?.windows?.min_execution_period || 0
        ) /
        (24 * 60 * 60),
      policyAsAdmin: false,
      minExecPeriodDuration: "Days",
      votingPeriodDuration: "Days",
    };
  }

  const decisionPolicyType =
    policyObj?.decision_policy?.["@type"] ===
    "/cosmos.group.v1.ThresholdDecisionPolicy"
      ? "threshold"
      : "percentage";

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
    getValues,
  } = useForm({
    defaultValues: {
      policyMetadata: policyInitialObj,
    },
  });

  const onSubmit = (data) => {
    handlePolicy(data);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset
          style={{
            border: "none",
          }}
        >
          <CreateGroupPolicy
            handleCancelPolicy={() => {}}
            setValue={setValue}
            reset={reset}
            register={register}
            errors={errors}
            watch={watch}
            control={control}
            policyUpdate={true}
            members={groupMembers}
            decisionPolicyType={decisionPolicyType}
          />
        </fieldset>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button onClick={() => handlePolicyClose()} sx={{ mx: "8px" }}>
            Cancel
          </Button>
          <Button variant="contained" type="submit" sx={{ mx: "8px" }}>
            Update
          </Button>
        </Box>
      </form>
    </>
  );
}

export default PolicyForm;
