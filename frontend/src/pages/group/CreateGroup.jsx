import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import {
  Button,
  Paper,
} from "@mui/material";
import { useForm, useFieldArray } from "react-hook-form";
import CreateGroupMembersForm from "./CreateGroupMembersForm";
import CreateGroupPolicy from "./CreateGroupPolicy";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { resetGroupTx, txCreateGroup } from "../../features/group/groupSlice";
import CreateGroupInfoForm from "./CreateGroupInfoForm";
import { useParams } from "react-router-dom";
import { DAYS, PERCENTAGE } from "./common";
import NavigateNextOutlinedIcon from "@mui/icons-material/NavigateNextOutlined";
import ArrowBackIosOutlinedIcon from "@mui/icons-material/ArrowBackIosOutlined";
import {
  resetError,
  resetTxHash,
  removeFeegrant as removeFeegrantState,
  setFeegrant as setFeegrantState,
} from "../../features/common/commonSlice";
import {
  getFeegrant,
  removeFeegrant as removeFeegrantLocalState,
} from "../../utils/localStorage";
import FeegranterInfo from "../../components/FeegranterInfo";
import ClearIcon from "@mui/icons-material/Clear";
import { StyledTableCell, StyledTableRow } from "../../components/CustomTable";

const steps = ["Group details", "Members", "Group Policy"];

export default function CreateGroupStepper() {
  const params = useParams();

  const [policyType, setPolicyType] = useState(PERCENTAGE);

  const selectedNetwork = useSelector(
    (state) => state.common.selectedNetwork.chainName
  );

  const currentNetwork = params?.networkName || selectedNetwork;

  const feegrant = useSelector(
    (state) => state.common.feegrant?.[currentNetwork] || {}
  );
  const networks = useSelector((state) => state.wallet.networks);
  const nameToChainIDs = useSelector((state) => state.wallet.nameToChainIDs);

  const address =
    networks[nameToChainIDs[currentNetwork]]?.walletInfo.bech32Address;
  const name = networks[nameToChainIDs[currentNetwork]]?.walletInfo.name;
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
      navigate(`/${currentNetwork}/groups`);
    }
  }, [txCreateGroupRes?.status]);

  useEffect(() => {
    return () => {
      dispatch(resetError());
      dispatch(resetTxHash());
    };
  }, []);

  useEffect(() => {
    const currentChainGrants = getFeegrant()?.[currentNetwork];
    dispatch(
      setFeegrantState({
        grants: currentChainGrants,
        chainName: currentNetwork.toLowerCase(),
      })
    );
  }, [currentNetwork, params]);

  const removeFeegrant = () => {
    // Should we completely remove feegrant or only for this session.
    dispatch(removeFeegrantState(currentNetwork));
    removeFeegrantLocalState(currentNetwork);
  };

  const dispatch = useDispatch();

  const createGroup = (policyMetadata) => {
    const data = {
      groupMetaData: groupMetaData,
      policyMetadata: policyMetadata,
      members: membersInfo,
    };
    const dataObj = {
      admin: address,
      members: data.members.members,
      groupMetaData: data.groupMetaData,
      chainId: chainInfo?.config?.chainId,
      feeAmount: chainInfo?.config?.feeCurrencies?.[0]?.gasPriceStep.average,
      denom: chainInfo?.config?.currencies?.[0]?.coinMinimalDenom,
      rest: chainInfo?.config?.rest,
      aminoConfig: chainInfo?.aminoConfig,
      prefix: chainInfo?.config?.bech32Config.bech32PrefixAccAddr,
      feegranter: feegrant?.granter,
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
      };

      if (data?.policyMetadata) {
        dataObj["policyData"] = {
          ...data.policyMetadata,
          minExecPeriod: getPeriod(
            data.policyMetadata?.minExecPeriodDuration,
            data.policyMetadata?.minExecPeriod
          ),
          votingPeriod: getPeriod(
            data.policyMetadata?.votingPeriodDuration,
            data.policyMetadata?.votingPeriod
          ),
        };
      }

      if (dataObj?.policyData?.decisionPolicy === PERCENTAGE) {
        dataObj.policyData.percentage =
          Number(dataObj.policyData.percentage) / 100.0;
      }
    }

    console.log(dataObj);
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
    setValue,
  } = useForm({
    defaultValues: {
      members: [
        {
          address: "",
          weight: "1",
          metadata: "",
        },
      ],
    },
  });

  useEffect(() => {
    setValue(`members.${0}.address`, address);
    setValue(`members.${0}.metadata`, name);
    setValue(`members.${0}.weight`, "1");
  }, [address, name]);

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
        votingPeriod: 21,
        minExecPeriod: 7,
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
              mb: 2,
            }}
            variant="outlined"
            disableElevation
            size="small"
            onClick={() => setActiveStep(activeStep === 0 ? 0 : activeStep - 1)}
            startIcon={<ArrowBackIosOutlinedIcon />}
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
    <Box
      sx={{
        m: 2,
        pb: 2,
      }}
    >
      {feegrant?.granter?.length > 0 ? (
        <FeegranterInfo
          feegrant={feegrant}
          onRemove={() => {
            removeFeegrant();
          }}
        />
      ) : null}
      <Stepper
        activeStep={activeStep}
        alternativeLabel
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
            <CreateGroupInfoForm
              control={controlInfo}
              errors={errorsInfo}
              getValues={getValuesGroupInfo}
            />
            <Button
              type="submit"
              variant="outlined"
              disableElevation
              sx={{
                mb: 2,
                mt: 1,
              }}
              size="small"
              endIcon={<NavigateNextOutlinedIcon />}
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
                    address={address}
                    name={name}
                  />
                </fieldset>
              ) : null}
            </Paper>
            <BackButton />
            <Button
              type="submit"
              variant="outlined"
              disableElevation
              sx={{
                mt: 1,
                ml: 1,
                mb: 2,
              }}
              size="small"
              endIcon={<NavigateNextOutlinedIcon />}
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
                    setValue={setValuePolicyInfo}
                    errors={errorsPolicyInfo}
                    fields={fields}
                    watch={watchPolicyInfo}
                    control={controlPolicyInfo}
                    members={getValuesMemberInfo("members")}
                    getValues={getValuesPolicyInfo}
                    setPolicyType={setPolicyType}
                    policyType={policyType}
                  />
                </fieldset>
              )) ||
                null}
            </Paper>
            <BackButton />
            <Button
              type="submit"
              variant="outlined"
              disableElevation
              sx={{
                mt: 1,
                ml: 1,
                mb: 2,
              }}
              size="small"
              disabled={txCreateGroupRes?.status === "pending"}
            >
              {txCreateGroupRes?.status === "pending"
                ? "Please wait..."
                : "Create Group"}
            </Button>
          </form>

          {/* group policy section end */}
        </>
      ) : (
        <></>
      )}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Button
          variant="outlined"
          size="small"
          onClick={() => {
            navigate(`/${currentNetwork}/groups`);
          }}
          startIcon={<ClearIcon />}
        >
          Cancel
        </Button>
      </div>
    </Box>
  );
}


