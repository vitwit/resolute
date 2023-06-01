import React from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
import { useForm, Controller } from "react-hook-form";
import Select from "@mui/material/Select";
import {
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Switch,
} from "@mui/material";
import { PERCENTAGE, THRESHOLD } from "../../pages/group/common";

export interface DecisionPolicyCallback {
  metadata: string;
  policyAsAdmin: boolean;
  decisionPolicy: DecisionPolicyEnum;
  threshold?: number;
  percentage?: number;
  votingPeriod: number;
  minExecutionPeriod: number;
}

export interface DialogAttachPolicyProps {
  onAttachPolicy: (data: DecisionPolicyCallback) => void;
  onClose: () => void;
  open: boolean;
  members: number;
}

enum DecisionPolicyEnum {
  threshold = "threshold",
  percentage = "percentage",
}

interface IFormInput {
  metadata: string;
  policyAsAdmin: boolean;
  decisionPolicy: DecisionPolicyEnum;
  threshold?: number;
  percentage?: number;
  votingPeriod: number;
  minExecutioPeriod: number;
}

export default function DialogAttachPolicy(props: DialogAttachPolicyProps) {
  const { open, onClose, onAttachPolicy, members } = props;

  const {
    handleSubmit,
    control,
    register,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = useForm<IFormInput>({
    defaultValues: {
      metadata: "",
      policyAsAdmin: false,
      decisionPolicy: DecisionPolicyEnum.threshold,
      threshold: 0,
      percentage: 0,
      minExecutioPeriod: 0,
      votingPeriod: 0,
    },
  });

  const onSubmit = (data: IFormInput) => {
    if (data.decisionPolicy === DecisionPolicyEnum.percentage) {
      onAttachPolicy({
        decisionPolicy: DecisionPolicyEnum.percentage,
        metadata: data.metadata,
        minExecutionPeriod: data.minExecutioPeriod,
        policyAsAdmin: data.policyAsAdmin,
        votingPeriod: data.votingPeriod,
        percentage: data.percentage,
        threshold: 0,
      });
    } else if (data.decisionPolicy === DecisionPolicyEnum.threshold) {
      onAttachPolicy({
        decisionPolicy: DecisionPolicyEnum.threshold,
        metadata: data.metadata,
        minExecutionPeriod: data.minExecutioPeriod,
        policyAsAdmin: data.policyAsAdmin,
        votingPeriod: data.votingPeriod,
        percentage: 0,
        threshold: data.threshold,
      });
    } else {
      alert("unknown decision policy");
    }
  };

  return (
    <Dialog onClose={() => onClose()} open={open}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Typography
            variant="h6"
            color="text.primary"
            fontWeight={800}
            style={{ textAlign: "center" }}
          >
            Add Group Policy
          </Typography>

          <Controller
            name="metadata"
            control={control}
            rules={{ required: "Metadata is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Policy metadata"
                style={{ marginTop: 8, marginBottom: 8 }}
                fullWidth
                error={!!errors.metadata}
                helperText={errors.metadata?.message}
              />
            )}
          />

          <Grid container spacing={4}>
            <Grid item md={8} xs={12}>
              <FormControl
                fullWidth
                required
                sx={{
                  mt: 2,
                }}
              >
                <InputLabel>Decision Policy</InputLabel>
                <Controller
                  name="decisionPolicy"
                  control={control}
                  defaultValue={DecisionPolicyEnum.threshold}
                  render={({ field }) => (
                    <Select
                      fullWidth
                      {...field}
                      label="Decision Policy"
                      required
                    >
                      <MenuItem value={DecisionPolicyEnum.threshold}>
                        Threshold policy
                      </MenuItem>
                      <MenuItem value={DecisionPolicyEnum.percentage}>
                        Percentage policy
                      </MenuItem>
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              {watch("decisionPolicy") === DecisionPolicyEnum.threshold ? (
                <Controller
                  name={THRESHOLD}
                  defaultValue={0}
                  control={control}
                  rules={{
                    min: 1,
                    max: 100,
                    validate: (v: number | undefined): boolean => { 
                      if (v !== undefined) {
                        return v < members;
                      }
                      return false;
                     }
                  }}
                  render={({ field }) => (
                    <TextField
                      sx={{
                        mt: 2,
                      }}
                      {...field}
                      label="Threshold"
                      type="number"
                      required
                      fullWidth
                      error={!!errors.threshold}
                      helperText={errors.threshold?.type === 'validate' ? 'Invalid threshold' : errors.threshold?.message}
                    />
                  )}
                />
              ) : (
                <Controller
                  name={PERCENTAGE}
                  defaultValue={0}
                  control={control}
                  rules={{
                    min: 1,
                    max: 100,
                  }}
                  render={({ field }) => (
                    <TextField
                      sx={{
                        mt: 2,
                      }}
                      {...field}
                      type="number"
                      label="Percentage"
                      required
                      fullWidth
                      error={!!errors.percentage}
                      helperText={errors.percentage?.message}
                    />
                  )}
                />
              )}
            </Grid>
          </Grid>

          {watch("decisionPolicy").length > 0 ? (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Controller
                  name="votingPeriod"
                  defaultValue={0}
                  control={control}
                  rules={{
                    min: 1,
                  }}
                  render={({ field }) => (
                    <TextField
                      sx={{
                        mt: 2,
                      }}
                      {...field}
                      label="Voting Period"
                      type="number"
                      required
                      fullWidth
                      error={!!errors.votingPeriod}
                      helperText={errors.votingPeriod?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="minExecutioPeriod"
                  defaultValue={0}
                  control={control}
                  rules={{
                    min: 1,
                  }}
                  render={({ field }) => (
                    <TextField
                      sx={{
                        mt: 2,
                      }}
                      {...field}
                      label="Min execution period"
                      type="number"
                      required
                      fullWidth
                      error={!!errors.minExecutioPeriod}
                      helperText={errors.minExecutioPeriod?.message}
                    />
                  )}
                />
              </Grid>
            </Grid>
          ) : (
            <></>
          )}

          <FormControlLabel
            name="policyAsAdmin"
            control={
              <Switch {...register("policyAsAdmin")} name="policyAsAdmin" />
            }
            label="Group policy as admin"
            labelPlacement="start"
          />
          <Typography
            sx={{
              display: "flex",
              pb: 1,
            }}
            variant="caption"
          >
            if set to true, the group policy account address will be used as
            group and policy admin
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            color="secondary"
            className="button-capitalize-title"
            disableElevation
            onClick={() => onClose()}
            sx={{
              textTransform: "none",
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            disableElevation
            type="submit"
            className="button-capitalize-title"
            sx={{
              textTransform: "none",
            }}
          >
            Attach Policy
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
