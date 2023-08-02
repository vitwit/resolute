import React, { useState } from "react";
import {
  TextField,
  FormControlLabel,
  Grid,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  Slider,
} from "@mui/material";
import { Controller } from "react-hook-form";
import { MAX_EXECUTION_PERIOD, PERCENTAGE, THRESHOLD } from "./common";

function CreateGroupPolicy({
  control,
  watch,
  errors,
  setValue,
  members,
  metadata,
  policy_Type,
  getValues,
  policyMetadataUpdate,
  policyUpdate,
  policyType,
  setPolicyType
}) {
  const totalWeight =
    members.reduce((initial, weight) => initial + Number(weight.weight), 0) ||
    0;

  const [asAdmin, setAsAdmin] = useState("gov");
  const [decisionPolicyType, setDecisionPolicyType] = useState(policy_Type);
  const [group_PolicyType, setGroup_PolicyType] = useState(PERCENTAGE);
  const groupPolicyType = policyType || group_PolicyType;
  const setGroupPolicyType = setPolicyType || setGroup_PolicyType;

  return (
    <Grid container spacing={2}>
      {policyUpdate ? (
        <></>
      ) : (
        <>
          {" "}
          <Grid item md={5} xs={12}>
            <Controller
              defaultValue={metadata?.name}
              name={`policyMetadata.name`}
              control={control}
              rules={{
                required: "Name is required",
                validate: () =>
                  getValues("policyMetadata.name").trim().length > 0,
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  size="small"
                  label="Name"
                  name="name"
                  fullWidth
                  error={errors?.policyMetadata?.name}
                  helperText={
                    errors?.policyMetadata?.name?.message ||
                    (errors?.policyMetadata?.name?.type === "validate" &&
                      "Name is required")
                  }
                />
              )}
            />
          </Grid>
          <Grid item md={7} xs={12}>
            <Controller
              defaultValue={metadata?.description}
              name={`policyMetadata.description`}
              control={control}
              rules={{
                required: "Description is required",
                maxLength: 100,
                validate: () =>
                  getValues("policyMetadata.description").trim().length > 0,
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  size="small"
                  label="Description"
                  name="description"
                  fullWidth
                  error={errors?.policyMetadata?.description}
                  helperText={
                    errors?.policyMetadata?.description?.message ||
                    (errors?.policyMetadata?.description?.type === "validate"
                      ? "Description is required"
                      : errors?.policyMetadata?.description?.type ===
                        "maxLength"
                      ? "Description cannot be more than 100 characters"
                      : null)
                  }
                />
              )}
            />
          </Grid>
        </>
      )}
      {policyUpdate || policyMetadataUpdate ? null : (
        <Grid
          item
          xs={12}
          sx={{
            textAlign: "left",
          }}
        >
          <Controller
            name={`policyMetadata.policyAsAdmin`}
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <FormLabel>Policy Admin</FormLabel>
                <RadioGroup
                  row
                  {...field}
                  onChange={(e) => {
                    setAsAdmin(e.target.value);
                    if (e.target.value === "gov") {
                      setValue("policyMetadata.policyAsAdmin", true);
                    } else {
                      setValue("policyMetadata.policyAsAdmin", false);
                    }
                  }}
                  value={asAdmin}
                >
                  <FormControlLabel
                    value={"self"}
                    control={<Radio />}
                    label="Self"
                  />
                  <FormControlLabel
                    value={"gov"}
                    control={<Radio />}
                    label="Governance"
                  />
                </RadioGroup>
              </FormControl>
            )}
          />
        </Grid>
      )}

      {policyMetadataUpdate ? null : (
        <>
          <Grid item md={6} xs={6}>
            <Controller
              fullWidth
              name={`policyMetadata.votingPeriod`}
              control={control}
              rules={{
                required: "Voting period is required",
                min: { value: 1, message: "Invalid voting period" },
              }}
              defaultValue={21}
              render={({ field }) => (
                <FormControl fullWidth>
                  <TextField
                    {...field}
                    fullWidth
                    required
                    label="Voting Period (Days)"
                    size="small"
                    name="votingPeriod"
                    type="number"
                    error={errors?.policyMetadata?.votingPeriod}
                    helperText={errors?.policyMetadata?.votingPeriod?.message}
                  />
                </FormControl>
              )}
            />
          </Grid>
          <Grid item md={6} xs={6}>
            <Controller
              fullWidth
              name={`policyMetadata.minExecPeriod`}
              control={control}
              rules={{
                required: "Execution delay is required",
                min: { value: 1, message: "Invalid Execution delay" },
                validate: () =>
                  Number(getValues("policyMetadata.minExecPeriod")) <
                  Number(getValues("policyMetadata.votingPeriod")) +
                    MAX_EXECUTION_PERIOD,
              }}
              defaultValue={7}
              render={({ field }) => (
                <FormControl fullWidth>
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    name="minExecPeriod"
                    label="Execution Delay (Days)"
                    type="number"
                    error={errors?.policyMetadata?.minExecPeriod}
                    helperText={
                      errors?.policyMetadata?.minExecPeriod?.message ||
                      (errors?.policyMetadata?.minExecPeriod &&
                        errors?.policyMetadata?.minExecPeriod?.type ===
                          "validate" &&
                        `Execution delay cannot be greater than ${
                          Number(getValues("policyMetadata.votingPeriod")) +
                          MAX_EXECUTION_PERIOD
                        }`)
                    }
                  />
                </FormControl>
              )}
            />
          </Grid>
        </>
      )}

      {policyMetadataUpdate ? null : (
        <>
          <Grid item md={4} xs={12}>
            <Controller
              name={`policyMetadata.decisionPolicy`}
              control={control}
              rules={{
                required: "Decision policy is required",
              }}
              render={({ field }) => (
                <FormControl
                  fullWidth
                  sx={{
                    mt: 1,
                  }}
                >
                  <FormLabel sx={{ textAlign: "left" }} id="Decision-Policy">
                    Decision Policy Type
                  </FormLabel>
                  <RadioGroup
                    row
                    {...field}
                    onChange={(e) => {
                      setGroupPolicyType(e.target.value);
                      setDecisionPolicyType(null);
                      setValue("policyMetadata.decisionPolicy", e.target.value);
                      if (e.target.value === THRESHOLD) {
                        setValue("policyMetadata.percentage", 0);
                      } else {
                        setValue("policyMetadata.threshold", 0);
                      }
                    }}
                    value={decisionPolicyType || groupPolicyType}
                  >
                    <FormControlLabel
                      value={PERCENTAGE}
                      control={<Radio />}
                      label="Percentage"
                    />
                    <FormControlLabel
                      value={THRESHOLD}
                      control={<Radio />}
                      label="Threshold"
                    />
                  </RadioGroup>
                </FormControl>
              )}
            />
          </Grid>
          <Grid
            item
            md={6}
            xs={12}
            sx={{
              mt: 1,
            }}
          >
            {watch("policyMetadata.decisionPolicy") === PERCENTAGE ? (
              <Controller
                name={`policyMetadata.percentage`}
                control={control}
                rules={{
                  required: "Percentage is required",
                  min: { value: 1, message: "Invalid percentage" },
                  max: { value: 100, message: "Invalid percentage" },
                }}
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    sx={{
                      mt: 3.5,
                    }}
                  >
                    <Slider
                      aria-label="Percentage"
                      min={1}
                      max={100}
                      valueLabelDisplay="on"
                      valueLabelFormat={(value) => <div>{value}%</div>}
                      {...field}
                      onChange={(_, value) => {
                        field.onChange(value);
                      }}
                      name={PERCENTAGE}
                    />
                  </FormControl>
                )}
              />
            ) : (
              <Controller
                name={`policyMetadata.threshold`}
                control={control}
                rules={{
                  required: "Threshold is required",
                  min: { value: 1, message: "Invalid threshold" },
                  max: {
                    value: totalWeight,
                    message: "Threshold is greater than group weight",
                  },
                }}
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    sx={{
                      mt: 3.5,
                    }}
                  >
                    <Slider
                      {...field}
                      name={THRESHOLD}
                      aria-label="Threshold"
                      defaultValue={totalWeight}
                      min={0}
                      max={totalWeight}
                      valueLabelDisplay="on"
                    />
                  </FormControl>
                )}
              />
            )}
          </Grid>
        </>
      )}
    </Grid>
  );
}
export default CreateGroupPolicy;
