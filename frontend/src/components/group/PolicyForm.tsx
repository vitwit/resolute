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
import { useForm, Controller } from "react-hook-form";
import { gpStyles } from "./groupCmpStyles";

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
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ...policyInitialObj,
    },
  });

  return (
    <Box sx={gpStyles.policy_box}>
      <Box sx={gpStyles.flex_center}>
        <Typography sx={gpStyles.f_22}>Add Decision Policy</Typography>
      </Box>
      <br />
      <form onSubmit={handleSubmit(handlePolicy)}>
        <Box>
          <Controller
            name="metadata"
            control={control}
            rules={{ required: "Metadata is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                name="metadata"
                placeholder="Policy Metadata*"
                required
              />
            )}
          />

          <Grid container spacing={2}>
            <Grid item sx={{ mt: 1.5 }} md={6} xs={6}>
              <Controller
                name="decisionPolicy"
                control={control}
                rules={{ required: "Decision policy is required" }}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel id="decision-policy">
                      Decision Policy*
                    </InputLabel>
                    <Select
                      {...field}
                      labelId="Decision Policy*"
                      id="decision-policy"
                      // value={policy.decisionPolicy}
                      label="Decision Policy*"
                      name="decisionPolicy"
                      // onChange={(e) => {
                      //     handleSelectChange(e.target.value)
                      // }}
                    >
                      <MenuItem value={"threshold"}>Threshold</MenuItem>
                      <MenuItem value={"percentage"}>Percentage</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item mt={1.5} md={6} xs={5}>
              {watch("decisionPolicy") === "percentage" ? (
                <Controller
                  name="percentage"
                  control={control}
                  rules={{
                    min: 0,
                    max: 1,
                    required: "Percentage is required",
                  }}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <TextField
                        {...field}
                        fullWidth
                        // onChange={handleChange}
                        sx={{ float: "right", textAlign: "right" }}
                        name="percentage"
                        // value={policy.percentage}
                        type="number"
                        placeholder="Percentage"
                      />
                    </FormControl>
                  )}
                />
              ) : (
                <Controller
                  name="threshold"
                  control={control}
                  rules={{
                    min: 1,
                    required: "Threshold is required",
                  }}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <TextField
                        fullWidth
                        name="threshold"
                        type="number"
                        placeholder="Threshold"
                      />
                    </FormControl>
                  )}
                />
              )}
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="votingPeriod"
                control={control}
                rules={{
                  required: "Voting period is required",
                }}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <TextField
                      {...field}
                      fullWidth
                      name="votingPeriod"
                      // type='number'
                      placeholder="Voting Period*"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="start"> Sec</InputAdornment>
                        ),
                      }}
                    />
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="minExecPeriod"
                control={control}
                rules={{
                  min: 1,
                  required: "Min Exec Period is required",
                }}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <TextField
                      {...field}
                      fullWidth
                      name="minExecPeriod"
                      // type='number'
                      placeholder="Min Exection Period*"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="start"> Sec</InputAdornment>
                        ),
                      }}
                    />
                  </FormControl>
                )}
              />
            </Grid>
          </Grid>
          <FormControlLabel
            name="policyAsAdmin"
            control={
              <Switch
                // {...register('policyAsAdmin')}
                // onChange={handleChange}
                name="policyAsAdmin"
              />
            }
            label="Group policy as admin"
            labelPlacement="start"
          />
          <Typography>
            if set to true, the group policy account address will be used as
            group and policy admin
          </Typography>
        </Box>

        <br />
        <Box>
          <Button
            color="error"
            onClick={() => handlePolicyClose()}
            variant="outlined"
            sx={gpStyles.j_center}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            // onClick={() => handlePolicySubmit()}
            variant="outlined"
            sx={gpStyles.j_center}
          >
            Add Policy
          </Button>
        </Box>
      </form>
    </Box>
  );
}

export default PolicyForm;
