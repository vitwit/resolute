import React from "react";
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  InputAdornment,
} from "@mui/material";
import { useForm, useFieldArray } from "react-hook-form";
import { gpStyles } from "./groupCmpStyles";
import CreateGroupPolicy from "../../pages/group/CreateGroupPolicy";

interface PolicyFormProps {
  handlePolicy: any;
  handlePolicyClose: any;
  policyObj?: any;
}

function PolicyForm({
  handlePolicy,
  policyObj,
  handlePolicyClose,
}: PolicyFormProps) {
  var policyInitialObj = {
    metadata: "",
    decisionPolicy: "",
    threshold: 0,
    percentage: 0,
    votingPeriod: "",
    minExecPeriod: 0,
  };

  if (policyObj) {
    policyInitialObj = {
      metadata: "sample " || policyObj?.metadata,
      decisionPolicy:
        policyObj?.decision_policy?.["@type"] ===
        "/cosmos.group.v1.ThresholdDecisionPolicy"
          ? "threshold"
          : "percentage",
      threshold: Number(policyObj?.decision_policy?.threshold || 0),
      percentage: Number(policyObj?.decision_policy?.percentage || 0),
      votingPeriod:
        "12" ||
        parseFloat(policyObj?.decision_policy?.windows?.voting_period || 0),
      minExecPeriod:
        12 ||
        parseFloat(
          policyObj?.decision_policy?.windows?.min_execution_period || 0
        ),
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
      policyMetadata: {
        name: "",
        description: "",
        decisionPolicy: "threshold",
        percentage: 1,
        threshold: 0,
        policyAsAdmin: false
      },
    },
  });

  const submitHandle = () => {
    console.log("here...")
    
  }


  return (
    <>
    <form onSubmit={submitHandle}>
      <fieldset
        style={{
          border: "none",
        }}
      >
        <CreateGroupPolicy
        policyUpdate={false}
        handleCancelPolicy={()=>{}}
          setValue={setValue}
          // reset={reset}
          register={register}
          errors={errors}
          watch={watch}
          control={control}
          members={["a","b"]}
        />
      </fieldset>
      <button type="submit">Submit</button>
      </form>
    </>
  );
}

export default PolicyForm;
