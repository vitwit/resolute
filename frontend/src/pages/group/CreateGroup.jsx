import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { Button, Paper, TextField, Typography } from "@mui/material";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import CreateGroupMembersForm from "./CreateGroupMembersForm";
import CreateGroupPolicy from "./CreateGroupPolicy";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resetGroupTx, txCreateGroup } from "../../features/group/groupSlice";
import { Grid } from "@mui/material";

const steps = ["Group information", "Add members", "Attach policy"];

export default function CreateGroupStepper() {
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
    console.log("form data")
    console.log(data)
    const groupMetaData = {
      name: data?.name,
      description: data?.description,
      forumUrl: data?.forumUrl,
    };
    const dataObj = {
      admin: address,
      members: data.members,
      groupMetaData: groupMetaData,
      chainId: chainInfo.config.chainId,
      feeAmount: chainInfo.config.gasPriceStep.average,
      denom: chainInfo?.config?.currencies?.[0]?.coinMinimalDenom,
      rest: chainInfo.config.rest,
      aminoConfig: chainInfo.aminoConfig,
      prefix: chainInfo.config.bech32Config.bech32PrefixAccAddr,
    };

    if (
      data.policyMetadata.percentage !== 0 ||
      data.policyMetadata.threshold !== 0
    ) {
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
    }

    dispatch(txCreateGroup(dataObj));
  };

  const [activeStep, setActiveStep] = React.useState(0);
  const [groupNameError, setGroupNameError] = useState("");
  const [groupDescError, setGroupDescError] = useState("");
  const [groupForumError, setGroupForumError] = useState("");
  const [memberInfoError, setMemberInfoError] = useState("");

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
        name: "",
        description: "",
        decisionPolicy: "threshold",
        percentage: 0,
        threshold: 0,
        policyAsAdmin: false
      },
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "members",
    rules: { minLength: 1 },
  });

  const watchAllFields = watch();

  const validateGroupInfo = () => {
    if (
      !watchAllFields.name?.length ||
      !watchAllFields.description?.length ||
      !watchAllFields.forumUrl?.length
    ) {
      setGroupNameError("name cannot be empty");
      setGroupDescError("description cannot be empty");
      setGroupForumError("forum url cannot be empty");
      return 0;
    }
    if (
      watchAllFields.name?.length > 25 ||
      watchAllFields.description?.length > 100 ||
      watchAllFields.forumUrl?.length > 25
    ) {
      setGroupNameError("name length error");
      setGroupDescError("desc length error");
      setGroupForumError("forum length error");
      return 0;
    }
    setGroupNameError("");
    setGroupDescError("");
    setGroupForumError("");
    return 1;
  };

  const validateMembersInfo = () => {
    const members = watchAllFields.members;
    for (let index in members) {
      if (
        !members[index].address?.length ||
        !members[index].metadata?.length ||
        !members[index].weight?.toString().length
      ) {
        setMemberInfoError("fields cannot be empty");
        return 0;
      }
    }
    setMemberInfoError("");
    return 1;
  };

  return (
    <Box sx={{ width: "100%" }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {activeStep === 0 ? (
          <>
            {/* group info section start */}
            <Paper
              elevation={0}
              sx={{
                p: 4,
              }}
            >
              <Grid container spacing={2}>
                <Grid item md={6} xs={12}>
                  <Controller
                    name="name"
                    control={control}
                    rules={{ required: "Name is required", maxLength: 25 }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        required
                        label="Name"
                        size="small"
                        name="Group name"
                        fullWidth
                        sx={{
                          mb: 2,
                        }}
                        error={groupNameError}
                        helperText={
                          watchAllFields.name?.length <= 25 &&
                          watchAllFields.name?.length > 0
                            ? setGroupNameError("")
                            : groupNameError ||
                              watchAllFields.name?.length === 0 ||
                              !watchAllFields.name?.length
                            ? groupNameError
                            : watchAllFields.name?.length < 25
                            ? setGroupNameError("")
                            : setGroupNameError("name length error")
                        }
                      />
                    )}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <Controller
                    name="forumUrl"
                    control={control}
                    rules={{ required: "Forum url is required", maxLength: 50 }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        required
                        label="Forum URL"
                        size="small"
                        name="Group forum"
                        fullWidth
                        sx={{
                          mb: 2,
                        }}
                        error={groupForumError}
                        helperText={
                          watchAllFields.forumUrl?.length <= 25 &&
                          watchAllFields.forumUrl?.length > 0
                            ? setGroupForumError("")
                            : groupForumError ||
                              watchAllFields.forumUrl?.length === 0 ||
                              !watchAllFields.forumUrl?.length
                            ? groupForumError
                            : watchAllFields.forumUrl?.length < 25
                            ? setGroupForumError("")
                            : setGroupForumError("forum length error")
                        }
                      />
                    )}
                  />
                </Grid>
              </Grid>
              <div>
                <Controller
                  name="description"
                  control={control}
                  rules={{
                    required: "Description is required",
                    maxLength: 60,
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      required
                      label="Description"
                      multiline
                      size="small"
                      name="Group description"
                      fullWidth
                      sx={{
                        mb: 2,
                      }}
                      error={groupDescError}
                      helperText={
                        watchAllFields.description?.length <= 100 &&
                        watchAllFields.description?.length > 0
                          ? setGroupDescError("")
                          : groupDescError ||
                            watchAllFields.description?.length === 0 ||
                            !watchAllFields.description?.length
                          ? groupDescError
                          : watchAllFields.description?.length < 25
                          ? setGroupDescError("")
                          : setGroupDescError("desc length error")
                      }
                    />
                  )}
                />
              </div>
            </Paper>
            {/* group info section end */}
          </>
        ) : activeStep === 1 ? (
          <Paper
            elevation={0}
            sx={{
              p: 4,
            }}
          >
            <Typography color="error">{memberInfoError}</Typography>
            {/* group members section start */}
            {fields.length ? (
              <fieldset
                style={{
                  border:"none"
                }}
              >
                <CreateGroupMembersForm
                  fields={fields}
                  control={control}
                  append={append}
                  remove={remove}
                  validateMembersInfo={validateMembersInfo}
                />
              </fieldset>
            ) : null}

            {/* group members section end */}
          </Paper>
        ) : activeStep === 2 ? (
          <Paper
            elevation={0}
            sx={{
              p: 4,
            }}
          >
            {/* group policy section start */}
            {(fields.length && (
              <fieldset
                style={{
                  border:"none"
                }}
              >
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
                />
              </fieldset>
            )) ||
              null}

            {/* group policy section end */}
          </Paper>
        ) : (
          <></>
        )}
        {activeStep !== 0 ? (
          <Button
            onClick={() => setActiveStep(activeStep === 0 ? 0 : activeStep - 1)}
          >
            Back
          </Button>
        ) : (
          <></>
        )}
        {activeStep !== 2 ? (
          <Button
            onClick={() => {
              if (activeStep === 0 && validateGroupInfo()) {
                setActiveStep(activeStep === 2 ? 0 : activeStep + 1);
              }
              if (activeStep === 1 && validateMembersInfo()) {
                setActiveStep(activeStep === 2 ? 0 : activeStep + 1);
              }
            }}
          >
            Next
          </Button>
        ) : (
          <></>
        )}
        {activeStep === 2 ? <Button type="submit">Create Group</Button> : <></>}
      </form>
    </Box>
  );
}
