import react, { useState, useEffect } from "react";
import { Button, Grid, IconButton, Paper, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import Send from "../../components/group/bulk/Send";
import UnDelegateForm from "../../components/group/bulk/UnDelegateForm";
import RedelegateForm from "../../components/group/bulk/RedelegateForm";
import { shortenAddress } from "../../utils/util";
import { Divider } from "@mui/material";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import {
  getAllValidators,
  getDelegations,
} from "../../features/staking/stakeSlice";
import Delegate from "../../components/group/bulk/Delegate";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import {
  DELEGATE_TYPE_URL,
  parseDelegateMsgsFromContent,
  parseReDelegateMsgsFromContent,
  parseSendMsgsFromContent,
  parseUnDelegateMsgsFromContent,
  REDELEGATE_TYPE_URL,
  SEND_TYPE_URL,
  UNDELEGATE_TYPE_URL,
} from "./utils";
import { parseBalance } from "../../utils/denom";
import { Pagination } from "@mui/material";
import { resetError, setError } from "../../features/common/commonSlice";
import TxBasicFields from "../../components/group/TxBasicFields";
import { useForm, FormProvider } from "react-hook-form";

// TODO: serve urls from env

const MULTISIG_SEND_TEMPLATE = "https://resolute.witval.com/_static/send.csv";
const MULTISIG_DELEGATE_TEMPLATE =
  "https://resolute.witval.com/_static/delegate.csv";
const MULTISIG_UNDELEGATE_TEMPLATE =
  "https://resolute.witval.com/_static/undelegate.csv";
const MULTISIG_REDELEGATE_TEMPLATE =
  "https://resolute.witval.com/_static/redelegate.csv";

const PER_PAGE = 6;

const TYPE_SEND = "SEND";
const TYPE_DELEGATE = "DELEGATE";
const TYPE_UNDELEGATE = "UNDELEGATE";
const TYPE_REDELEGATE = "REDELEGATE";

const SelectTransactionType = (props) => {
  return (
    <Box
      sx={{
        minHeight: 70,
      }}
    >
      <Button
        variant="contained"
        disableElevation
        sx={{
          textTransform: "none",
        }}
        size="small"
        onClick={() => props.onSelect("manual")}
      >
        Single transaction
      </Button>
      <Button
        variant="contained"
        disableElevation
        size="small"
        onClick={() => props.onSelect("file")}
        sx={{
          mb: 2,
          mt: 2,
          ml: 1,
          textTransform: "none",
        }}
      >
        File upload
      </Button>
    </Box>
  );
};

const FileUpload = (props) => {
  const [txType, setTxType] = useState(TYPE_SEND);
  return (
    <Box
      sx={{
        minHeight: 100,
      }}
    >
      <FormControl
        fullWidth
        sx={{
          mt: 1,
        }}
      >
        <InputLabel id="demo-simple-select-label">
          Select Transaction
        </InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={txType}
          label="Select Transaction"
          onChange={(event) => {
            setTxType(event.target.value);
          }}
        >
          <MenuItem value={TYPE_SEND}>Send</MenuItem>
          <MenuItem value={TYPE_DELEGATE}>Delegate</MenuItem>
          <MenuItem value={TYPE_REDELEGATE}>Redelegate</MenuItem>
          <MenuItem value={TYPE_UNDELEGATE}>Undelegate</MenuItem>
        </Select>
      </FormControl>

      <Button
        variant="contained"
        disableElevation
        size="small"
        endIcon={<FileDownloadOutlinedIcon />}
        sx={{
          textTransform: "none",
        }}
        onClick={() => {
          switch (txType) {
            case TYPE_SEND:
              window.open(
                MULTISIG_SEND_TEMPLATE,
                "_blank",
                "noopener,noreferrer"
              );
              break;
            case TYPE_DELEGATE:
              window.open(
                MULTISIG_DELEGATE_TEMPLATE,
                "_blank",
                "noopener,noreferrer"
              );
              break;
            case TYPE_UNDELEGATE:
              window.open(
                MULTISIG_UNDELEGATE_TEMPLATE,
                "_blank",
                "noopener,noreferrer"
              );
              break;
            case TYPE_REDELEGATE:
              window.open(
                MULTISIG_REDELEGATE_TEMPLATE,
                "_blank",
                "noopener,noreferrer"
              );
              break;
            default:
              alert("unknown message type");
          }
        }}
      >
        Download template
      </Button>
      <Button
        variant="contained"
        disableElevation
        aria-label="upload file"
        size="small"
        endIcon={<FileUploadOutlinedIcon />}
        sx={{
          mb: 2,
          mt: 2,
          ml: 1,
          textTransform: "none",
        }}
        onClick={() => {
          document.getElementById("multisig_file").click();
        }}
      >
        <input
          id="multisig_file"
          accept="*.csv"
          hidden
          type="file"
          onChange={(e) => {
            const file = e.target.files[0];
            if (!file) {
              return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
              const contents = e.target.result;
              props.onFileContents(contents, txType);
            };
            reader.onerror = (e) => {
              alert(e);
            };
            reader.readAsText(file);
            e.target.value = null;
          }}
        />
        Upload csv file
      </Button>
      <Button
        onClick={() => props.handleCancel()}
        sx={{ ml: 3 }}
        variant="outlined"
        color="error"
      >
        Cancel
      </Button>
    </Box>
  );
};

export default function PagePolicyTx({ control, setValue }) {
  const { policyAddress: address } = useParams();

  const [txType, setTxType] = useState("");

  const wallet = useSelector((state) => state.wallet);
  const { chainInfo, connected } = wallet;

  const validators = useSelector((state) => state.staking.validators);
  const methods = useForm({
    defaultValues: {
      gas: 20000,
    },
  });
  const onSubmit = (data) => console.log(data);

  const dispatch = useDispatch();
  useEffect(() => {
    if (connected) {
      dispatch(
        getAllValidators({
          baseURL: chainInfo.config.rest,
          status: null,
        })
      );

      dispatch(
        getDelegations({
          baseURL: chainInfo.config.rest,
          address: address,
        })
      );
    }
  }, [connected]);

  const handleTypeChange = (event) => {
    setTxType(event.target.value);
  };

  const [messages, setMessages] = useState([]);

  const renderMessage = (msg, index, currency, onDelete) => {
    switch (msg.typeUrl) {
      case SEND_TYPE_URL: {
        return RenderSendMessage(msg, index, currency, onDelete);
      }
      case DELEGATE_TYPE_URL:
        return RenderDelegateMessage(msg, index, currency, onDelete);
      case UNDELEGATE_TYPE_URL:
        return RenderUnDelegateMessage(msg, index, currency, onDelete);
      case REDELEGATE_TYPE_URL:
        return RenderReDelegateMessage(msg, index, currency, onDelete);
      default:
        return "";
    }
  };

  const onDeleteMsg = (index) => {
    const arr = messages.filter((_, i) => i !== index);
    setMessages(arr);
    setValue("msgs", arr);
  };

  const onFileContents = (content, type) => {
    switch (type) {
      case TYPE_SEND: {
        const [parsedTxns, error] = parseSendMsgsFromContent(address, content);
        if (error) {
          dispatch(
            setError({
              type: "error",
              message: error,
            })
          );
        } else {
          setMessages(parsedTxns);
          setValue("msgs", parsedTxns);
        }
        break;
      }
      case TYPE_DELEGATE: {
        const [parsedTxns, error] = parseDelegateMsgsFromContent(
          address,
          content
        );
        if (error) {
          dispatch(
            setError({
              type: "error",
              message: error,
            })
          );
        } else {
          setMessages(parsedTxns);
          setValue("msgs", parsedTxns);
        }
        break;
      }
      case TYPE_REDELEGATE: {
        const [parsedTxns, error] = parseReDelegateMsgsFromContent(
          address,
          content
        );
        if (error) {
          dispatch(
            setError({
              type: "error",
              message: error,
            })
          );
        } else {
          setMessages(parsedTxns);
          setValue("msgs", parsedTxns);
        }
        break;
      }
      case TYPE_UNDELEGATE: {
        const [parsedTxns, error] = parseUnDelegateMsgsFromContent(
          address,
          content
        );
        if (error) {
          dispatch(
            setError({
              type: "error",
              message: error,
            })
          );
        } else {
          setMessages(parsedTxns);
          setValue("msgs", parsedTxns);
        }
        break;
      }
      default:
        setMessages([]);
        setValue("msgs", []);
    }
  };

  const [mode, setMode] = useState("");

  const [slicedMsgs, setSlicedMsgs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  // var createRes = useSelector((state) => state.multisig.createTxnRes);

  let navigate = useNavigate();
  // useEffect(() => {
  //     if (createRes?.status === "rejected") {
  //         dispatch(
  //             setError({
  //                 type: "error",
  //                 message: createRes?.error,
  //             })
  //         );
  //     } else if (createRes?.status === "idle") {
  //         dispatch(
  //             setError({
  //                 type: "success",
  //                 message: "Transaction created",
  //             })
  //         );

  //         setTimeout(() => {
  //             navigate(`/multisig/${address}/txs`);
  //         }, 200);
  //     }
  // }, [createRes]);

  useEffect(() => {
    return () => {
      dispatch(resetError());
      // dispatch(resetCreateTxnState());
    };
  }, []);

  useEffect(() => {
    if (messages.length < PER_PAGE) {
      setSlicedMsgs(messages);
    } else {
      setCurrentPage(1);
      setSlicedMsgs(messages?.slice(0, 1 * PER_PAGE));
    }
  }, [messages]);

  //   const { handleSubmit, control, setValue } = useForm({
  //     defaultValues: {
  //       msgs: [],
  //       gas: 200000,
  //       memo: "",
  //       fees:
  //         chainInfo?.config?.feeCurrencies?.[0]?.gasPriceStep?.average *
  //         10 ** chainInfo?.config?.currencies[0].coinDecimals,
  //     },
  //   });

  // const onSubmit = (data) => {
  //     const feeObj = fee(
  //         chainInfo?.config.currencies[0].coinMinimalDenom,
  //         data.fees,
  //         data.gas
  //     );
  //     dispatch(
  //         createTxn({
  //             address: address,
  //             chainId: chainInfo?.config?.chainId,
  //             msgs: messages,
  //             fee: feeObj,
  //             memo: data.memo,
  //             gas: data.gas,
  //         })
  //     );
  // };

  return (
    <>
      {!connected ? (
        <Typography
          sx={{
            mt: 4,
          }}
          variant="h5"
          color="text.primary"
        >
          Wallet is not connected
        </Typography>
      ) : (
        <Grid
          container
          spacing={2}
          sx={{
            mt: 1,
          }}
        >
          <Grid item md={5} xs={12}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 0,
                p: 3,
                minHeight: 290,
              }}
            >
              {mode === "" ? (
                <SelectTransactionType onSelect={(mode) => setMode(mode)} />
              ) : mode === "manual" ? (
                <>
                  <FormControl
                    fullWidth
                    sx={{
                      mt: 1,
                    }}
                  >
                    <InputLabel id="demo-simple-select-label">
                      Select Transaction
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={txType}
                      label="Select Transaction"
                      onChange={handleTypeChange}
                    >
                      <MenuItem value={"Send"}>Send</MenuItem>
                      <MenuItem value={"Delegate"}>Delegate</MenuItem>
                      <MenuItem value={"Redelegate"}>Redelegate</MenuItem>
                      <MenuItem value={"Undelegate"}>Undelegate</MenuItem>
                    </Select>
                  </FormControl>
                </>
              ) : (
                <FileUpload
                  handleCancel={() => setMode("")}
                  onFileContents={(content, type) =>
                    onFileContents(content, type)
                  }
                />
              )}

              {mode === "manual" ? (
                <FormProvider {...methods}>
                  <form onSubmit={methods.handleSubmit(onSubmit)}>
                    {txType === "Send" ? (
                      <Send
                        chainInfo={chainInfo}
                        address={address}
                        onSend={(payload) => {
                          console.log("value---", payload);
                          setMessages([...messages, payload]);
                          setValue("msgs", [...messages, payload]);
                        }}
                      />
                    ) : null}

                    {txType === "Delegate" ? (
                      <Delegate
                        chainInfo={chainInfo}
                        address={address}
                        validators={validators}
                        onDelegate={(payload) => {
                          setMessages([...messages, payload]);
                          setValue("msgs", [...messages, payload]);
                        }}
                      />
                    ) : null}

                    {txType === "Redelegate" ? (
                      <RedelegateForm
                        chainInfo={chainInfo}
                        address={address}
                        onRedelegate={(payload) => {
                          setMessages([...messages, payload]);
                          setValue("msgs", [...messages, payload]);
                        }}
                      />
                    ) : null}

                    {txType === "Undelegate" ? (
                      <UnDelegateForm
                        chainInfo={chainInfo}
                        address={address}
                        onUndelegate={(payload) => {
                          setMessages([...messages, payload]);
                          setValue("msgs", [...messages, payload]);
                        }}
                      />
                    ) : null}

                    <TxBasicFields chainInfo={chainInfo} />

                    <Button type="submit">Submit</Button>
                  </form>
                </FormProvider>
              ) : null}
              {/* <Button
                                onClick={() => setMode('')}
                                sx={{ float: 'right', mt: -5,width: '20%' }}
                                variant="outlined" color="error">
                                Cancel
                            </Button> */}
            </Paper>
          </Grid>

          <Grid item md={7} xs={12}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 0,
                p: 1,
                minHeight: 320,
              }}
            >
              <Typography color="text.primary" variant="h6" fontWeight={600}>
                Messages
              </Typography>
              <Box
                sx={{
                  p: 1,
                }}
              >
                {messages.length === 0 ? (
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    fontWeight={600}
                    sx={{
                      mt: 2,
                    }}
                  >
                    No Messages
                  </Typography>
                ) : null}
                {slicedMsgs.map((msg, index) => {
                  return (
                    <Box
                      component="div"
                      key={index + PER_PAGE * (currentPage - 1)}
                    >
                      {renderMessage(
                        msg,
                        index + PER_PAGE * (currentPage - 1),
                        chainInfo.config.currencies[0],
                        onDeleteMsg
                      )}
                      <Divider />
                    </Box>
                  );
                })}

                {messages.length > 0 ? (
                  <Pagination
                    sx={{
                      mt: 1,
                    }}
                    count={Math.ceil(messages.length / PER_PAGE)}
                    shape="circular"
                    onChange={(_, v) => {
                      setCurrentPage(v);
                      setSlicedMsgs(
                        messages?.slice((v - 1) * PER_PAGE, v * PER_PAGE)
                      );
                    }}
                  />
                ) : null}

                {messages.length > 0 ? (
                  <TxBasicFields
                    chainInfo={chainInfo}
                    setValue={setValue}
                    control={control}
                  />
                ) : //                 <Grid
                //                     container
                //                     spacing={2}
                //                     sx={{
                //                         mt: 2,
                //                     }}
                //                 >
                //                     <Grid item xs={12} md={4}>
                //                         <Controller
                //                             name="gas"
                //                             control={control}
                //                             rules={{ required: "Gas is required" }}
                //                             render={({ field, fieldState: { error } }) => (
                //                                 <TextField
                //                                     sx={{
                //                                         mb: 2,
                //                                     }}
                //                                     {...field}
                //                                     error={!!error}
                //                                     size="small"
                //                                     helperText={error ? error.message : null}
                //                                     type="number"
                //                                     required
                //                                     label="Gas"
                //                                     fullWidth
                //                                 />
                //                             )}
                //                         />
                //                     </Grid>
                //                     <Grid item xs={12} md={8}>
                //                         <Controller
                //                             name="memo"
                //                             control={control}
                //                             render={({ field }) => (
                //                                 <TextField
                //                                     sx={{
                //                                         mb: 2,
                //                                     }}
                //                                     size="small"
                //                                     {...field}
                //                                     label="Memo"
                //                                     fullWidth
                //                                 />
                //                             )}
                //                         />
                //                     </Grid>
                //                     <Grid
                //                         item
                //                         xs={12}
                //                         md={12}
                //                         sx={{
                //                             pt: 0,
                //                             textAlign: "left",
                //                         }}
                //                     >
                //                         <FeeComponent
                //                             sx={{
                //                                 pt: 0,
                //                                 textAlign: "left",
                //                             }}
                //                             onSetFeeChange={(v) => {
                //                                 setValue(
                //                                     "fees",
                //                                     Number(v) *
                //                                     10 **
                //                                     chainInfo?.config?.currencies[0].coinDecimals
                //                                 );
                //                             }}
                //                             chainInfo={chainInfo}
                //                         />
                //                     </Grid>

                //                     {/* <Grid
                //     item
                //     xs={12}
                //     md={12}
                //     sx={{
                //       justifyContent: "right",
                //     }}
                //   >
                //     <Button
                //       type="submit"
                //       variant="contained"
                //       disableElevation
                //       sx={{
                //         mt: 2,
                //         textTransform: "none",
                //       }}
                //       disabled={createRes.status === "pending"}
                //     >
                //       {createRes.status === "pending"
                //         ? "Please wait..."
                //         : "Create"}
                //     </Button>
                //   </Grid> */}
                //                 </Grid>
                null}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}
    </>
  );
}

export const RenderSendMessage = (message, index, currency, onDelete) => {
  return (
    <Box
      component="div"
      sx={{
        display: "flex",
        justifyContent: "space-between",
        pt: 1,
      }}
    >
      <Box
        component="div"
        sx={{
          display: "flex",
        }}
      >
        <Typography variant="body2" color="text.primary" fontWeight={500}>
          #{index + 1}&nbsp;&nbsp;
        </Typography>
        <Typography variant="body2" color="text.primary" fontWeight={600}>
          Send&nbsp;
        </Typography>
        <Typography variant="body2" color="text.primary" fontWeight={600}>
          {parseBalance(
            message.value.amount,
            currency.coinDecimals,
            currency.coinMinimalDenom
          )}
          {currency.coinDenom}&nbsp;
        </Typography>
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          to&nbsp;
        </Typography>
        <Typography variant="body2" color="text.primary" fontWeight={600}>
          {shortenAddress(message.value.toAddress, 21)}
        </Typography>
      </Box>
      {onDelete ? (
        <IconButton
          color="error"
          aria-label="delete transaction"
          component="label"
          onClick={() => onDelete(index)}
        >
          <DeleteOutline />
        </IconButton>
      ) : null}
    </Box>
  );
};

export const RenderDelegateMessage = (message, index, currency, onDelete) => {
  return (
    <Box
      component="div"
      sx={{
        display: "flex",
        justifyContent: "space-between",
        pt: 1,
      }}
    >
      <Box
        component="div"
        sx={{
          display: "flex",
        }}
      >
        <Typography variant="body2" color="text.primary" fontWeight={500}>
          #{index + 1}&nbsp;&nbsp;
        </Typography>
        <Typography variant="body2" color="text.primary" fontWeight={600}>
          Delegate&nbsp;
        </Typography>
        <Typography variant="body2" color="text.primary" fontWeight={600}>
          {parseBalance(
            message.value.amount,
            currency.coinDecimals,
            currency.coinMinimalDenom
          )}
          {currency.coinDenom}&nbsp;
        </Typography>
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          to&nbsp;
        </Typography>
        <Typography variant="body2" color="text.primary" fontWeight={600}>
          {shortenAddress(message.value.validatorAddress, 21)}
        </Typography>
      </Box>
      {onDelete ? (
        <IconButton
          color="error"
          aria-label="delete transaction"
          component="label"
          onClick={() => onDelete(index)}
        >
          <DeleteOutline />
        </IconButton>
      ) : null}
    </Box>
  );
};

export const RenderUnDelegateMessage = (message, index, currency, onDelete) => {
  return (
    <Box
      component="div"
      sx={{
        display: "flex",
        justifyContent: "space-between",
        pt: 1.5,
      }}
    >
      <Box
        component="div"
        sx={{
          display: "flex",
        }}
      >
        <Typography variant="body2" color="text.primary" fontWeight={500}>
          #{index + 1}&nbsp;&nbsp;
        </Typography>
        <Typography variant="body2" color="text.primary" fontWeight={600}>
          Undelegate&nbsp;
        </Typography>
        <Typography variant="body2" color="text.primary" fontWeight={600}>
          {parseBalance(
            [message.value.amount],
            currency.coinDecimals,
            currency.coinMinimalDenom
          )}
          {currency.coinDenom}&nbsp;
        </Typography>
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          from&nbsp;
        </Typography>
        <Typography variant="body2" color="text.primary" fontWeight={600}>
          {shortenAddress(message.value?.validatorAddress || "", 21)}
        </Typography>
      </Box>
      {onDelete ? (
        <IconButton
          color="error"
          aria-label="delete transaction"
          component="label"
          onClick={() => onDelete(index)}
        >
          <DeleteOutline />
        </IconButton>
      ) : null}
    </Box>
  );
};

export const RenderReDelegateMessage = (message, index, currency, onDelete) => {
  return (
    <Box
      component="div"
      sx={{
        display: "flex",
        justifyContent: "space-between",
        pt: 1.5,
      }}
    >
      <Box
        component="div"
        sx={{
          display: "flex",
        }}
      >
        <Typography variant="body2" color="text.primary" fontWeight={500}>
          #{index + 1}&nbsp;&nbsp;
        </Typography>
        <Typography variant="body2" color="text.primary" fontWeight={600}>
          Redelegate&nbsp;
        </Typography>
        <Typography variant="body2" color="text.primary" fontWeight={600}>
          {parseBalance(
            message.value.amount,
            currency.coinDecimals,
            currency.coinMinimalDenom
          )}
          {currency.coinDenom}&nbsp;
        </Typography>
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          from&nbsp;
        </Typography>
        <Typography variant="body2" color="text.primary" fontWeight={600}>
          {shortenAddress(message.value.validatorSrcAddress, 21)}&nbsp;
        </Typography>
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          to&nbsp;
        </Typography>
        <Typography variant="body2" color="text.primary" fontWeight={600}>
          {shortenAddress(message.value.validatorDstAddress, 21)}
        </Typography>
      </Box>
      {onDelete ? (
        <IconButton
          color="error"
          aria-label="delete transaction"
          component="label"
          onClick={() => onDelete(index)}
        >
          <DeleteOutline />
        </IconButton>
      ) : null}
    </Box>
  );
};
