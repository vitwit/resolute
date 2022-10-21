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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Controller } from "react-hook-form";

function CreateGroupPolicy({
  control,
  register,
  watch,
  fields,
  errors,
  setValue,
  handleCancelPolicy,
  members,
}) {
  const totalWeight = members.reduce(
    (initial, weight) => initial + Number(weight.weight),
    0
  );

  const [threshold, setThreshold] = useState("threshold");

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Button
          size="small"
          onClick={() => handleCancelPolicy()}
          sx={{ marginLeft: "auto", textTransform: "none" }}
          endIcon={<CloseIcon />}
          variant="outlined"
          color="error"
        >
          Remove
        </Button>
      </Box>

      <Box
        sx={{
          mt: 1,
        }}
      >
        <Controller
          name={`policyMetadata.metadata`}
          control={control}
          rules={{
            required: "Metadata is required",
          }}
          render={({ field }) => (
            <TextField
              {...field}
              required
              size="small"
              label="Policy Metadata"
              name="metadta"
              fullWidth
            />
          )}
        />
        <Grid
          container
          spacing={2}
          sx={{
            mt: 0.5,
          }}
        >
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
                    mt: 1.5,
                  }}
                >
                  <InputLabel id="Decision-Policy">
                    Decision Policy Type
                  </InputLabel>
                  <Select
                    fullWidth
                    {...field}
                    size="small"
                    required
                    placeholder="Decision policy*"
                    labelId="Decision-Policy*"
                    id="decision-policy"
                    label="Decision Policy Type*"
                    name="decisionPolicy"
                    value={threshold}
                    onChange={(e) => {
                      setThreshold(e.target.value);
                      setValue("policyMetadata.decisionPolicy", e.target.value);
                    }}
                  >
                    <MenuItem value={"threshold"}>Threshold</MenuItem>
                    <MenuItem value={"percentage"}>Percentage</MenuItem>
                  </Select>
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
                  <FormControl fullWidth>
                    <TextField
                      {...field}
                      fullWidth
                      name="percentage"
                      label="Percentage"
                      required
                      size="small"
                      type="number"
                      placeholder="Percentage"
                      error={errors?.policyMetadata?.percentage}
                      helperText={errors?.policyMetadata?.percentage?.message}
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
                  <FormControl fullWidth>
                    <TextField
                      {...field}
                      fullWidth
                      name="threshold"
                      type="number"
                      label="Threshold"
                      required
                      placeholder="Threshold"
                      size="small"
                      error={errors?.policyMetadata?.threshold}
                      helperText={errors?.policyMetadata?.threshold?.message}
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
                    label="Voting Period*"
                    placeholder="Voting Period*"
                    InputProps={{
                      endAdornment: (
                        <FormControl sx={{ width: 130, mr: "-13px" }} fullWidth>
                          <Select
                            fullWidth
                            required
                            placeholder="Duration*"
                            label="Duration*"
                            size="small"
                            labelId="duration"
                            id="duration"
                            onChange={(e) => {
                              setValue(
                                "policyMetadata.votingPeriodDuration",
                                e.target.value
                              );
                            }}
                            value={
                              watch("policyMetadata.votingPeriodDuration") ||
                              "Days"
                            }
                            name="votingPeriodDuration"
                          >
                            <MenuItem defaultValue={"Days"} value={"Days"}>
                              Days
                            </MenuItem>
                            <MenuItem defaultChecked value={"Hours"}>
                              Hours
                            </MenuItem>
                            <MenuItem value={"Minutes"}>Minutes</MenuItem>
                          </Select>
                        </FormControl>
                      ),
                    }}
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
              }}
              render={({ field }) => (
                <FormControl fullWidth>
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    name="minExecPeriod"
                    type="number"
                    placeholder="Min Exection Period"
                    InputProps={{
                      endAdornment: (
                        <FormControl sx={{ width: 150, mr: "-13px" }} fullWidth>
                          <Select
                            fullWidth
                            required
                            size="small"
                            label="Duration*"
                            labelId="duration"
                            id="duration"
                            onChange={(e) => {
                              setValue(
                                "policyMetadata.minExecPeriodDuration",
                                e.target.value
                              );
                            }}
                            value={
                              watch("policyMetadata.minExecPeriodDuration") ||
                              "Days"
                            }
                            name="minExecPeriodDuration"
                          >
                            <MenuItem value={"Days"} defaultChecked>
                              Days
                            </MenuItem>
                            <MenuItem value={"Hours"}>Hours</MenuItem>
                            <MenuItem value={"Minutes"}>Minutes</MenuItem>
                          </Select>
                        </FormControl>
                      ),
                    }}
                    error={errors?.policyMetadata?.minExecPeriod}
                    helperText={
                      errors?.policyMetadata?.minExecPeriod?.message ||
                      "A Minimum amount of time that must pass after submission in order for a proposal to potentially be executed."
                    }
                  />
                </FormControl>
              )}
            />
          </Grid>
        </Grid>
        <br />
        <Box textAlign={"left"}>
          <FormControlLabel
            name="policyAsAdmin"
            control={
              <Switch
                {...register("policyMetadata.policyAsAdmin")}
                name="policyAsAdmin"
                defaultValue={false}
                onChange={(e) => {
                  setValue("policyMetadata.policyAsAdmin", e.target.checked);
                }}
              />
            }
            label="Group policy as admin"
            labelPlacement="start"
          />
          <br />
          <Typography variant="caption">
            If set to true, the group policy account address will be used as
            group and policy admin
          </Typography>
        </Box>
      </Box>
    </>
  );
}

export default CreateGroupPolicy;
