import Button from "@mui/material/Button";
import React, { useEffect, useState } from "react";
import { Paper, Grid, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { resetGroupTx, txCreateGroup } from "../../features/group/groupSlice";
import CreateGroupMembersForm from "./CreateGroupMembersForm";
import CreateGroupPolicy from "./CreateGroupPolicy";
import { useNavigate } from "react-router-dom";

export default function CreateGroupPage() {
  const [showAddPolicyForm, setShowAddPolicyForm] = useState(null);

  const wallet = useSelector((state) => state.wallet);
  const { chainInfo, address } = wallet;
  const navigate = useNavigate();
  const txCreateGroupRes = useSelector(
    (state) => state?.group?.txCreateGroupRes
  );

  useEffect(() => {
    return () => {
      dispatch(resetGroupTx());
    };
  }, []);

  useEffect(() => {
    if (txCreateGroupRes?.status === "idle") {
      navigate(`/group`);
    }
  }, [txCreateGroupRes?.status]);

  const dispatch = useDispatch();

  const onSubmit = (data) => {
    const dataObj = {
      admin: address,
      members: data.members,
      groupMetaData: data?.metadata,
      chainId: chainInfo.config.chainId,
      rpc: chainInfo.config.rpc,
      feeAmount: chainInfo.config.gasPriceStep.average,
      denom: chainInfo?.config?.currencies?.[0]?.coinMinimalDenom,
    };

    const getMinExecPeriod = (policyData) => {
      let time;
      if (policyData?.minExecPeriodDuration === "Days") time = 24 * 60 * 60;
      else if (policyData?.minExecPeriodDuration === "Hours") time = 60 * 60;
      else if (policyData?.minExecPeriodDuration === "Minutes") time = 60;
      else time = 1;

      time = time * Number(policyData?.minExecPeriod);
      return time;
    };

    const getVotingPeriod = (policyData) => {
      let time;
      if (policyData?.votingPeriodDuration === "Days") time = 24 * 60 * 60;
      else if (policyData?.votingPeriodDuration === "Hours") time = 60 * 60;
      else if (policyData?.votingPeriodDuration === "Minutes") time = 60;
      else time = 1;

      time = time * Number(policyData?.votingPeriod);
      return time;
    };

    if (data?.policyMetadata) {
      dataObj["policyData"] = {
        ...data.policyMetadata,
        minExecPeriod: getMinExecPeriod(data.policyMetadata),
        votingPeriod: getVotingPeriod(data.policyMetadata),
      };
    }

    if (dataObj?.policyData?.decisionPolicy === "percentage") {
      dataObj.policyData.percentage =
        Number(dataObj.policyData.percentage) / 100.0;
    }

    dispatch(txCreateGroup(dataObj));
  };

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
      members: [
        {
          address: "",
          weight: 0,
          metadata: "",
        },
      ],
      policyMetadata: {
        metadata: "",
        decisionPolicy: "threshold",
        percentage: 0,
        threshold: 0,
      }
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "members",
    rules: { minLength: 1 },
  });

  return (
    <Grid container>
      <Grid item md={2} />
      <Grid item md={8} xs={12}>
        <Paper elevation={0} sx={{ p: 2, textAlign: "center" }}>
          <Typography color="text.primary" variant="h6" fontWeight={600}>
            Create Group
          </Typography>
          <Box
            noValidate
            autoComplete="off"
            sx={{
              "& .MuiTextField-root": { mt: 1.5, mb: 1.5 },
              p: 2,
              margin: "0 auto",
            }}
          >
            <form onSubmit={handleSubmit(onSubmit)}>
              <div>
                <Controller
                  name="metadata"
                  control={control}
                  rules={{ required: "Metadata is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      required
                      label="Group Metadata"
                      multiline
                      size="small"
                      name="Group Metadata"
                      fullWidth
                    />
                  )}
                />
              </div>

              <Box
                component={"div"}
                sx={{
                  textAlign: "right",
                  mt: 1,
                }}
              >
                {/* group members section start */}
                {/* {(!fields?.length && (
                  <Button
                    onClick={() => {
                      // append({ address: "", weight: 0, metadata: "" });
                    }}
                    variant="outlined"
                    sx={{
                      textTransform: "none",
                    }}
                    size="small"
                  >
                    Add Group Member
                  </Button>
                )) ||
                  null} */}

                {fields.length ? (
                  <fieldset
                    style={{
                      textAlign: "left",
                      borderWidth: 1.5,
                      borderRadius: 6,
                      borderColor: "#b9b9b966",
                    }}
                  >
                    <Typography
                      component="legend"
                      variant="body1"
                      fontWeight={500}
                    >
                      Group members
                    </Typography>

                    <CreateGroupMembersForm
                      fields={fields}
                      control={control}
                      append={append}
                      remove={remove}
                    />
                  </fieldset>
                ) : null}

                {/* group members section end */}

                {/* group policy section start */}
                {(fields?.length &&
                  ((!showAddPolicyForm && (
                    <Button
                      onClick={() => {
                        setShowAddPolicyForm(true);
                        setValue("policyMetadata.decisionPolicy", "threshold");
                        setValue("policyMetadata.votingPeriodDuration", "Days");
                        setValue(
                          "policyMetadata.minExecPeriodDuration",
                          "Days"
                        );
                      }}
                      variant="outlined"
                      sx={{
                        textTransform: "none",
                        mt: 2,
                      }}
                      size="small"
                    >
                      Attach Decision Policy
                    </Button>
                  )) ||
                    null)) ||
                  null}

                {(fields.length && showAddPolicyForm && (
                  <fieldset
                    style={{
                      textAlign: "left",
                      borderWidth: 1.5,
                      borderRadius: 6,
                      marginTop: 16,
                      borderColor: "#b9b9b966",
                    }}
                  >
                    <Typography
                      variant="body1"
                      color="text.primary"
                      fontWeight={500}
                      component="legend"
                    >
                      Decision Policy
                    </Typography>
                    <CreateGroupPolicy
                      handleCancelPolicy={() => {
                        setValue("policyMetadata", null);
                        setShowAddPolicyForm(false);
                      }}
                      setValue={setValue}
                      reset={reset}
                      register={register}
                      errors={errors}
                      fields={fields}
                      watch={watch}
                      control={control}
                      members={getValues("members")}
                      showRemoveButton={true}
                    />
                  </fieldset>
                )) ||
                  null}

                {/* group policy section end */}
              </Box>

              <Button
                onClick={() => navigate(`/group`)}
                color="error"
                variant="outlined"
                disableElevation
                size="medium"
                sx={{
                  mt: 2,
                  mr: 2,
                }}
              >
                cancel
              </Button>
              <Button
                disabled={txCreateGroupRes?.status === "pending"}
                type="submit"
                variant="outlined"
                disableElevation
                size="medium"
                sx={{
                  mt: 2,
                }}
              >
                {txCreateGroupRes?.status === "pending"
                  ? "Loading..."
                  : "Create"}
              </Button>
            </form>
          </Box>
        </Paper>
      </Grid>
      <Grid item md={2} />
    </Grid>
  );
}
