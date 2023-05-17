import React, { useState } from "react";
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
  FormLabel,
  RadioGroup,
  Radio,
  Slider,
} from "@mui/material";
import { Controller } from "react-hook-form";
import { MAX_EXECUTION_PERIOD } from "./common";

function CreateGroupPolicy({
  control,
  register,
  watch,
  errors,
  setValue,
  handleCancelPolicy,
  members,
  policyUpdate,
  policyMetadataUpdate,
  metadata,
  policy_Type,
  getValues,
}) {
  const totalWeight =
    members.reduce((initial, weight) => initial + Number(weight.weight), 0) ||
    0;

  const [threshold, setThreshold] = useState("threshold");
  const [policyType, setPolicyType] = useState("threshold");
  const [asAdmin, setAsAdmin] = useState("gov");
  const [decisionPolicyType, setDecisionPolicyType] = useState(policy_Type)

  return (
    <>
      <Box
        sx={{
          mt: 1,
        }}
      >
        {policyUpdate ? (
          <></>
        ) : (
          <Grid container spacing={2} sx={{ marginBottom: "32px" }}>
            <Grid item md={6} xs={12}>
              <Controller
                defaultValue={metadata?.name}
                name={`policyMetadata.name`}
                control={control}
                rules={{
                  required: "Metadata is required",
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    size="small"
                    label="Name"
                    name="name"
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <Controller
                defaultValue={metadata?.description}
                name={`policyMetadata.description`}
                control={control}
                rules={{
                  required: "Metadata is required",
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    size="small"
                    label="Description"
                    name="description"
                    fullWidth
                  />
                )}
              />
            </Grid>
          </Grid>
        )}
        {policyMetadataUpdate ? null : (
          <>
            <Grid container spacing={4}>
              <Grid item md={6} xs={12}>
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
                      <FormLabel
                        sx={{ textAlign: "left" }}
                        id="Decision-Policy"
                      >
                        Decision Policy Type
                      </FormLabel>
                      <RadioGroup
                        row
                        {...field}
                        onChange={(e) => {
                          setPolicyType(e.target.value);
                          setDecisionPolicyType(null);
                          setValue(
                            "policyMetadata.decisionPolicy",
                            e.target.value
                          );
                          if (e.target.value === "threshold") {
                            setValue("policyMetadata.percentage", 0);
                          } else {
                            setValue("policyMetadata.threshold", 0);
                          }
                        }}
                        value={decisionPolicyType || policyType}
                      >
                        <FormControlLabel
                          value={"percentage"}
                          control={<Radio />}
                          label="Percentage"
                        />
                        <FormControlLabel
                          value={"threshold"}
                          control={<Radio />}
                          label="Threshold"
                        />
                      </RadioGroup>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                {watch("policyMetadata.decisionPolicy") === "percentage" ? (
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
                          mt: 1,
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
                          name="percentage"
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
                          mt: 1,
                        }}
                      >
                        <Slider
                          {...field}
                          name="threshold"
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
              <Grid item md={6} xs={12}>
                <Controller
                  fullWidth
                  name={`policyMetadata.votingPeriod`}
                  control={control}
                  rules={{
                    required: "Voting period is required",
                    min: { value: 1, message: "Invalid voting period" },
                  }}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <TextField
                        {...field}
                        fullWidth
                        size="small"
                        name="votingPeriod"
                        type="number"
                        label="Voting Period (Days) *"
                        placeholder="Voting Period (Days) *"
                        error={errors?.policyMetadata?.votingPeriod}
                        helperText={
                          errors?.policyMetadata?.votingPeriod?.message ||
                          "A maximum time after submission that a proposal may be voted on before it is tallied"
                        }
                      />
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <Controller
                  fullWidth
                  name={`policyMetadata.minExecPeriod`}
                  control={control}
                  rules={{
                    required: "Min Exec Period is required",
                    min: { value: 1, message: "Invalid Min execution period" },
                    validate: () => Number(getValues("policyMetadata.minExecPeriod")) < (Number(getValues("policyMetadata.votingPeriod")) + MAX_EXECUTION_PERIOD )
                  }}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <TextField
                        {...field}
                        fullWidth
                        size="small"
                        name="minExecPeriod"
                        type="number"
                        label="Min Execution Period (Days) *"
                        placeholder="Min Execution Period (Days) *"
                        error={errors?.policyMetadata?.minExecPeriod}
                        helperText={
                          errors?.policyMetadata?.minExecPeriod?.message || (errors?.policyMetadata?.minExecPeriod && errors?.policyMetadata?.minExecPeriod?.type === "validate" && `Min execution period cannot be greater than ${Number(getValues("policyMetadata.votingPeriod"))-1 + MAX_EXECUTION_PERIOD}` ) ||
                          "A Minimum amount of time that must pass after submission in order for a proposal to potentially be executed."
                        }
                      />
                    </FormControl>
                  )}
                />
              </Grid>
            </Grid>
            <br />
            {policyUpdate || policyMetadataUpdate ? null : (
              <Box textAlign={"left"}>
                <Controller
                  name={`policyMetadata.policyAsAdmin`}
                  control={control}
                  render={({ field }) => (
                    <FormControl
                      fullWidth
                      sx={{
                        mt: 1,
                      }}
                    >
                      <FormLabel>Policy Admin</FormLabel>
                      <RadioGroup
                        row
                        {...field}
                        onChange={(e) => {
                          setAsAdmin(e.target.value);
                          if (e.target.value === "self") {
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
              </Box>
            )}
          </>
        )}
      </Box>
    </>
  );
}

export default CreateGroupPolicy;
