import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { Button, Paper } from "@mui/material";
import { useForm, useFieldArray } from "react-hook-form";
import CreateGroupMembersForm from "./CreateGroupMembersForm";
import CreateGroupPolicy from "./CreateGroupPolicy";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resetGroupTx, txCreateGroup } from "../../features/group/groupSlice";
import CreateGroupInfoForm from "./CreateGroupInfoForm";
import { useParams } from "react-router-dom";
import { DAYS, PERCENTAGE } from "./common";

const steps = ["Group information", "Add members", "Attach policy"];

export default function CreateGroupStepper() {
  const params = useParams();

  const selectedNetwork = useSelector(
    (state) => state.common.selectedNetwork.chainName
  );

  const currentNetwork = params?.networkName || selectedNetwork;
  const networks = useSelector((state) => state.wallet.networks);
  const nameToChainIDs = useSelector((state) => state.wallet.nameToChainIDs);

  const address =
    networks[nameToChainIDs[currentNetwork]]?.walletInfo.bech32Address;

  const chainInfo = networks[nameToChainIDs[currentNetwork]]?.network;

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
      navigate(`/${currentNetwork}/daos`);
    }
  }, [txCreateGroupRes?.status]);

  const dispatch = useDispatch();

  const createGroup = (policyMetadata) => {
    const data = {
      "groupMetaData": groupMetaData,
      "policyMetadata": policyMetadata,
      "members": membersInfo,
    };
    const dataObj = {
      admin: address,
      members: data.members.members,
      groupMetaData: data.groupMetaData,
      chainId: chainInfo?.config?.chainId,
      feeAmount: chainInfo?.config?.gasPriceStep.average,
      denom: chainInfo?.config?.currencies?.[0]?.coinMinimalDenom,
      rest: chainInfo?.config?.rest,
      aminoConfig: chainInfo?.aminoConfig,
      prefix: chainInfo?.config?.bech32Config.bech32PrefixAccAddr,
    };

    if (
      data.policyMetadata.percentage !== 0 ||
      data.policyMetadata.threshold !== 0
    ) {

      const getPeriod = (duration, period) => {
        let time;
        if (duration === DAYS) time = 24 * 60 * 60;
        else time = 1;

        time = time * Number(period);
        return time;
      }

      if (data?.policyMetadata) {
        dataObj["policyData"] = {
          ...data.policyMetadata,
          minExecPeriod: getPeriod(data.policyMetadata?.minExecPeriodDuration, data.policyMetadata?.minExecPeriod),
          votingPeriod: getPeriod(data.policyMetadata?.votingPeriodDuration, data.policyMetadata?.votingPeriod),
        };
      }

      if (dataObj?.policyData?.decisionPolicy === PERCENTAGE) {
        dataObj.policyData.percentage =
          Number(dataObj.policyData.percentage) / 100.0;
      }
    }
    dispatch(txCreateGroup(dataObj));
  };

  const [activeStep, setActiveStep] = React.useState(0);

  const [groupMetaData, setGroupMetaData] = useState({});
  const [membersInfo, setMembersInfo] = useState({});

  const onSubmitInfo = (data) => {
    setGroupMetaData(data);
    setActiveStep(activeStep + 1);
  };

  const onSubmitMemberInfo = (data) => {
    setMembersInfo(data);
    setActiveStep(activeStep + 1);
  };

  const onSubmitPolicyInfo = (data) => {
    createGroup(data.policyMetadata);
  };

  const {
    control: controlInfo,
    handleSubmit: handleSubmitInfo,
    getValues: getValuesGroupInfo,
    formState: { errors: errorsInfo },
  } = useForm({
    defaultValues: {
      name: "",
      forumUrl: "",
      description: "",
    },
  });

  const {
    control: controlMemberInfo,
    handleSubmit: handleSubmitMemberInfo,
    getValues: getValuesMemberInfo,
    formState: { errors: errorsMemberInfo },
  } = useForm({
    defaultValues: {
      members: [
        {
          address: "",
          weight: 0,
          metadata: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: controlMemberInfo,
    name: "members",
    rules: { minLength: 1 },
  });

  const {
    control: controlPolicyInfo,
    handleSubmit: handleSubmitPolicyInfo,
    formState: { errors: errorsPolicyInfo },
    watch: watchPolicyInfo,
    setValue: setValuePolicyInfo,
    getValues: getValuesPolicyInfo,
  } = useForm({
    defaultValues: {
      policyMetadata: {
        name: "",
        description: "",
        decisionPolicy: PERCENTAGE,
        percentage: 1,
        threshold: 1,
        policyAsAdmin: false,
        minExecPeriodDuration: DAYS,
        votingPeriodDuration: DAYS,
      },
    },
  });

  const BackButton = () => {
    return (
      <>
        {activeStep !== 0 ? (
          <Button
            sx={{
              mt: 1,
            }}
            variant="outlined"
            disableElevation
            size="small"
            onClick={() => setActiveStep(activeStep === 0 ? 0 : activeStep - 1)}
          >
            Back
          </Button>
        ) : (
          <></>
        )}
      </>
    );
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Stepper activeStep={activeStep} alternativeLabel
        sx={{
          mb: 1,
        }}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {activeStep === 0 ? (
        <>
          {/* group info section start */}

          <form onSubmit={handleSubmitInfo(onSubmitInfo)}>
            <fieldset style={{ border: "none" }}>
              <CreateGroupInfoForm control={controlInfo} errors={errorsInfo} getValues={getValuesGroupInfo} />
            </fieldset>
            <Button type="submit"
              variant="outlined"
              disableElevation
              size="small"
            >
              Next
              </Button>
          </form>

          {/* group info section end */}
        </>
      ) : activeStep === 1 ? (
        <>
          {/* group members section start */}

          <form onSubmit={handleSubmitMemberInfo(onSubmitMemberInfo)}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
              }}
            >
              {fields.length ? (
                <fieldset
                  style={{
                    border: "none",
                  }}
                >
                  <CreateGroupMembersForm
                    fields={fields}
                    control={controlMemberInfo}
                    append={append}
                    remove={remove}
                    errors={errorsMemberInfo}
                    getValues={getValuesMemberInfo}
                  />
                </fieldset>
              ) : null}
            </Paper>
            <BackButton />
            <Button type="submit"
            variant="outlined"
            disableElevation
            sx={{
              mt: 1,
              ml: 1,
            }}
            size="small"
            >
              Next
            </Button>
          </form>

          {/* group members section end */}
        </>
      ) : activeStep === 2 ? (
        <>
          {/* group policy section start */}

          <form onSubmit={handleSubmitPolicyInfo(onSubmitPolicyInfo)}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
              }}
            >
              {(fields.length && (
                <fieldset
                  style={{
                    border: "none",
                  }}
                >
                  <CreateGroupPolicy
                    handleCancelPolicy={() => {
                      setValuePolicyInfo("policyMetadata", null);
                    }}
                    policyUpdate={false}
                    setValue={setValuePolicyInfo}
                    errors={errorsPolicyInfo}
                    fields={fields}
                    watch={watchPolicyInfo}
                    control={controlPolicyInfo}
                    members={getValuesMemberInfo("members")}
                    getValues={getValuesPolicyInfo}
                  />
                </fieldset>
              )) ||
                null}
            </Paper>
            <BackButton />
            <Button type="submit"
            variant="outlined"
            disableElevation
            sx={{
              mt: 1,
              ml: 1,
            }}
            size="small"
            >Create Group</Button>
          </form>

          {/* group policy section end */}
        </>
      ) : (
        <></>
      )}
    </Box>
  );
}
