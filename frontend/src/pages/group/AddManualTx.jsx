import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Delegate from "../../components/group/bulk/Delegate";
import RedelegateForm from "../../components/group/bulk/RedelegateForm";
import Send from "../../components/group/bulk/Send";
import UnDelegateForm from "../../components/group/bulk/UnDelegateForm";
import TxBasicFields from "../../components/group/TxBasicFields";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { Decimal } from "@cosmjs/math";
import {
  getAllValidators,
  getDelegations,
  resetDefaultState,
} from "../../features/staking/stakeSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  resetCreateGroupProposalRes,
  txCreateGroupProposal,
} from "../../features/group/groupSlice";
import { useNavigate, useParams } from "react-router-dom";
import { setError } from "../../features/common/commonSlice";
import { DELEGATE_TYPE_URL, SEND_TYPE_URL, UNDELEGATE_TYPE_URL } from "./utils";
import { RenderSendMessage } from "./AddFileTx";
import {
  RenderUnDelegateMessage,
  RenderDelegateMessage,
} from "../multisig/tx/PageCreateTx";

const TYPE_SEND = "SEND";
const TYPE_DELEGATE = "DELEGATE";
const TYPE_UNDELEGATE = "UNDELEGATE";
const TYPE_REDELEGATE = "REDELEGATE";

const TxMsgsList = ({ messages = [], currency, onDelete }) => {
  return (
    <Box
      sx={{
        p: 2,
      }}
    >
      {messages.map((m, i) => (
        <Box component="div" key={i}>
          {m?.typeUrl === SEND_TYPE_URL
            ? RenderSendMessage(m, i, currency, onDelete)
            : null}

          {m?.typeUrl === DELEGATE_TYPE_URL
            ? RenderDelegateMessage(m, i, currency, onDelete)
            : null}
          {m?.typeUrl === UNDELEGATE_TYPE_URL
            ? RenderUnDelegateMessage(m, i, currency, onDelete)
            : null}
        </Box>
      ))}
    </Box>
  );
};

const getAmountInAtomics = (amount, currency) => {
  const amountInAtomics = Decimal.fromUserInput(
    amount,
    Number(currency.coinDecimals)
  ).atomics;

  return {
    amount: amountInAtomics,
    denom: currency.coinMinimalDenom,
  };
};

function AddManualTx({
  address,
  chainInfo,
  handleCancel,
  adminAddress,
  networkName,
}) {
  const { policyAddress, id } = useParams();
  var [messages, setMessages] = useState([]);

  const currency = chainInfo?.config?.currencies[0];

  const [txType, setTxType] = useState(null);

  const methods = useForm({
    defaultValues: {
      gas: 20000,
      metadata: {
        title: "",
        details: "",
        summary: "",
        forumurl: "",
      },
    },
  });
  const {
    getValues,
    formState: { errors: errors },
  } = methods;
  const dispatch = useDispatch();

  const validators = null;
  const wallet = useSelector((state) => state.wallet);

  useEffect(() => {
    dispatch(
      getAllValidators({
        baseURL: chainInfo?.config?.rest,
        chainID: chainInfo?.config?.chainId,
        status: null,
      })
    );
    dispatch(
      getDelegations({
        address: address,
        baseURL: chainInfo?.config?.rest,
        chainID: chainInfo?.config?.chainId,
      })
    );
  }, [chainInfo, wallet]);

  var createRes = useSelector((state) => state.group.groupProposalRes);

  let navigate = useNavigate();

  useEffect(() => {
    if (createRes?.status === "rejected") {
      dispatch(
        setError({
          type: "error",
          message: createRes?.error,
        })
      );
    } else if (createRes?.status === "idle") {
      dispatch(
        setError({
          type: "success",
          message: "Transaction created",
        })
      );

      setTimeout(() => {
        navigate(`/${networkName}/daos/${id}/policies/${policyAddress}`);
      }, 200);
    }
  }, [createRes?.status]);

  useEffect(() => {
    return () => {
      dispatch(resetCreateGroupProposalRes());
    };
  }, []);

  const onSubmit = (data) => {
    dispatch(
      txCreateGroupProposal({
        metadata: JSON.stringify(data?.metadata),
        admin: adminAddress,
        proposers: [adminAddress],
        messages: messages,
        groupPolicyAddress: address,
        chainId: chainInfo?.config?.chainId,
        rpc: chainInfo?.config?.rpc,
        denom: chainInfo?.config.currencies[0].coinMinimalDenom,
        feeAmount: data?.fees,
        memo: data?.memo,
        gas: data?.gas,
      })
    );
  };

  const onMsgSubmit = (data) => {
    let msg = {};

    switch (data.txType) {
      case TYPE_SEND:
        msg = {
          typeUrl: "/cosmos.bank.v1beta1.MsgSend",
          value: {
            fromAddress: address,
            toAddress: data.toAddress,
            amount: [getAmountInAtomics(data.amount, currency)],
          },
          ...msg,
        };
        break;

      case TYPE_DELEGATE:
        msg = {
          typeUrl: "/cosmos.staking.v1beta1.MsgDelegate",
          value: {
            delegatorAddress: address,
            validatorAddress: data?.validator?.value,
            amount: getAmountInAtomics(data.amount, currency),
          },
          ...msg,
        };
      case TYPE_UNDELEGATE:
        msg = {
          typeUrl: "/cosmos.staking.v1beta1.MsgUndelegate",
          value: {
            delegatorAddress: address,
            validatorAddress: data?.validator?.value,
            amount: getAmountInAtomics(data.amount, currency),
          },
          ...msg,
        };
        break;
      case TYPE_REDELEGATE:
        alert("todo");
        return;
      default:
        return;
    }

    messages = [...messages, msg];
    setMessages(messages);
    methods.reset();
    setTxType(null);
    methods.setValue("txType", "");
  };

  const onDelete = (index) => {
    messages.splice(index, 1);
    setMessages([...messages]);
  };

  return (
    <Grid
      container
      spacing={4}
      sx={{
        mt: 1,
      }}
    >
      <Grid item xs={12} md={5}>
        <Box>
          <FormProvider {...methods}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Select Transaction
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Select Transaction"
                defaultValue={TYPE_SEND}
                onChange={(event) => {
                  setTxType(event.target.value);
                  methods.setValue("txType", event.target.value);
                }}
              >
                <MenuItem value={""}>Select Transaction Type</MenuItem>
                <MenuItem value={TYPE_SEND}>Send</MenuItem>
                <MenuItem value={TYPE_DELEGATE}>Delegate</MenuItem>
                <MenuItem value={TYPE_REDELEGATE}>Redelegate</MenuItem>
                <MenuItem value={TYPE_UNDELEGATE}>Undelegate</MenuItem>
              </Select>
            </FormControl>

            <form onSubmit={methods.handleSubmit(onMsgSubmit)}>
              {txType === TYPE_SEND ? <Send currency={currency} /> : null}

              {txType === TYPE_DELEGATE ? (
                <Delegate currency={currency} validators={validators} />
              ) : null}

              {txType === TYPE_REDELEGATE ? (
                <RedelegateForm currency={currency} validators={validators} />
              ) : null}

              {txType === TYPE_UNDELEGATE ? (
                <UnDelegateForm currency={currency} validators={validators} />
              ) : null}

              <Button
                size="small"
                variant="contained"
                type="submit"
                sx={{
                  textTransform: "none",
                  mt: 1.2,
                }}
                disableElevation
              >
                Add Message
              </Button>
            </form>
          </FormProvider>
        </Box>
      </Grid>
      <Grid item xs={12} md={7}>
        {messages?.length ? (
          <Box component={"div"}>
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmit)}>
                <Controller
                  name="metadata.title"
                  control={methods.control}
                  rules={{
                    required: "Title is required",
                    maxLength: {
                      value: 30,
                      message: "Title length cannot be more than 30 characters",
                    },
                    validate: () =>
                      getValues("metadata.title").trim().length > 0,
                  }}
                  render={({ field }) => (
                    <TextField
                      sx={{
                        mt: 1,
                      }}
                      {...field}
                      label="Proposal Title *"
                      fullWidth
                      size="small"
                      error={errors?.metadata?.title}
                      helperText={
                        errors?.metadata?.title?.message ||
                        (errors?.metadata?.title?.type === "validate" &&
                          "Title is required")
                      }
                    />
                  )}
                />

                <Controller
                  name="metadata.details"
                  control={methods.control}
                  rules={{
                    maxLength: {
                      value: 70,
                      message:
                        "Details length cannot be more than 80 characters",
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      sx={{
                        mt: 1,
                      }}
                      {...field}
                      label="Details"
                      fullWidth
                      size="small"
                      multiline
                      error={errors?.metadata?.details}
                      helperText={errors?.metadata?.details?.message}
                    />
                  )}
                />

                <Controller
                  name="metadata.summary"
                  control={methods.control}
                  rules={{
                    maxLength: {
                      value: 100,
                      message:
                        "Summary length cannot be more than 100 characters",
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      sx={{
                        mt: 1,
                      }}
                      {...field}
                      label="Summary"
                      fullWidth
                      size="small"
                      multiline
                      error={errors?.metadata?.summary}
                      helperText={errors?.metadata?.summary?.message}
                    />
                  )}
                />

                <Controller
                  name="metadata.forumurl"
                  control={methods.control}
                  rules={{
                    maxLength: {
                      value: 40,
                      message:
                        "Forum URL length cannot be more than 30 characters",
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      sx={{
                        mt: 1,
                      }}
                      type="url"
                      {...field}
                      label="Forum URL"
                      fullWidth
                      size="small"
                      error={errors?.metadata?.forumurl}
                      helperText={errors?.metadata?.forumurl?.message}
                    />
                  )}
                />

                <Typography
                  mt={2}
                  textAlign={"left"}
                  variant="body1"
                  fontWeight={600}
                >
                  Messages
                </Typography>
                <TxMsgsList
                  onDelete={onDelete}
                  currency={currency}
                  messages={messages}
                />

                <TxBasicFields chainInfo={chainInfo} />

                <Box mt={2}>
                  <Button
                    sx={{ mr: 2 }}
                    onClick={() => handleCancel()}
                    variant="outlined"
                    color="error"
                  >
                    Cancel
                  </Button>

                  <Button
                    disabled={createRes?.status === "pending"}
                    variant="outlined"
                    type="submit"
                  >
                    Submit
                  </Button>
                </Box>
              </form>
            </FormProvider>
          </Box>
        ) : null}
      </Grid>
    </Grid>
  );
}

export default AddManualTx;
