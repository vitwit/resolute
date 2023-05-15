import React from "react";
import { Button } from "@mui/material";
import { useForm } from "react-hook-form";
import CreateGroupPolicy from "../../pages/group/CreateGroupPolicy";

function PolicyForm({ handlePolicy, policyObj, handlePolicyClose }) {
    // console.log("policy data:")
    // console.log(policyObj)
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
      name: JSON.parse(policyObj?.metadata).name || "Sample name",
      description:
        JSON.parse(policyObj?.metadata).description || "Sample description",
      decisionPolicy:
        policyObj?.decision_policy?.["@type"] ===
        "/cosmos.group.v1.ThresholdDecisionPolicy"
          ? "threshold"
          : "percentage",
      threshold: Number(policyObj?.decision_policy?.threshold || 0),
      percentage: Number(policyObj?.decision_policy?.percentage || 1),
      votingPeriod:
        "12" ||
        parseFloat(policyObj?.decision_policy?.windows?.voting_period || 0),
      minExecPeriod:
        12 ||
        parseFloat(
          policyObj?.decision_policy?.windows?.min_execution_period || 0
        ),
      policyAsAdmin: false,
    };
  }

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
    // console.log("submitted data:.....")
    // console.log(data);
    handlePolicy(data)
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
            members={[
              { address: "q", weight: "1", metadata: "q" },
              { address: "q", weight: "1", metadata: "q" },
            ]}
          />
        </fieldset>
        <Button onClick={()=>handlePolicyClose()}>Cancel</Button>
        <Button type="submit">Submit</Button>
      </form>
    </>
  );
}

export default PolicyForm;
