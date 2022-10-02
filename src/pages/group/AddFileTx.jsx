import {
    Box, FormControl, Grid, InputLabel,
    MenuItem, Pagination, Select, Typography,
    IconButton,
    Button,
    TextField,
} from '@mui/material'
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Divider } from "@mui/material";
import { useForm, Controller, FormProvider, useFormContext } from "react-hook-form";
import DeleteOutline from "@mui/icons-material/DeleteOutline";

import FileProposalOptions from '../../components/group/FileProposalOptions';
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

import { setError } from '../../features/common/commonSlice';
import TxBasicFields from '../../components/group/TxBasicFields';
import { parseBalance } from "../../utils/denom";
import { shortenAddress } from '../../utils/util';
import { useNavigate, useParams } from 'react-router-dom';
import { resetCreateGroupProposalRes, txCreateGroupProposal } from '../../features/group/groupSlice';

const TYPE_SEND = "SEND";
const TYPE_DELEGATE = "DELEGATE";
const TYPE_UNDELEGATE = "UNDELEGATE";
const TYPE_REDELEGATE = "REDELEGATE";


const PER_PAGE = 6;

function AddFileTx({ address }) {
    const { policyAddress, id } = useParams();

    const [txType, setTxType] = useState();
    const [messages, setMessages] = useState([]);
    const [slicedMsgs, setSlicedMsgs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    const dispatch = useDispatch();

    const wallet = useSelector(state => state?.wallet);
    const { chainInfo } = wallet;

    const methods = useForm({
        defaultValues: {
            gas: 20000
        }
    });
    const { setValue, control, handleSubmit } = methods;

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
                navigate(`/groups/${id}/policies/${policyAddress}`);
            }, 200);
        }
    }, [createRes?.status]);

    useEffect(() => {
        return () => {
            dispatch(resetCreateGroupProposalRes())
        }
    }, [])

    useEffect(() => {
        if (messages.length < PER_PAGE) {
            setSlicedMsgs(messages);
        } else {
            setCurrentPage(1);
            setSlicedMsgs(messages?.slice(0, 1 * PER_PAGE));
        }
    }, [messages]);

    const onDeleteMsg = (index) => {
        const arr = messages.filter((_, i) => i !== index);
        setMessages(arr);
        setValue('msgs', arr)
    };

    const onFileContents = (content, type) => {
        switch (type) {
            case TYPE_SEND: {
                const [parsedTxns, error] = parseSendMsgsFromContent(policyAddress, content);
                if (error) {
                    dispatch(
                        setError({
                            type: "error",
                            message: error,
                        })
                    );
                } else {
                    setMessages(parsedTxns);
                    methods.setValue('msgs', parsedTxns)
                }
                break;
            }
            case TYPE_DELEGATE: {
                const [parsedTxns, error] = parseDelegateMsgsFromContent(
                    policyAddress,
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
                    methods.setValue('msgs', parsedTxns)
                }
                break;
            }
            case TYPE_REDELEGATE: {
                const [parsedTxns, error] = parseReDelegateMsgsFromContent(
                    policyAddress,
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
                    methods.setValue('msgs', parsedTxns)
                }
                break;
            }
            case TYPE_UNDELEGATE: {
                const [parsedTxns, error] = parseUnDelegateMsgsFromContent(
                    policyAddress,
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
                    methods.setValue('msgs', parsedTxns);
                }
                break;
            }
            default:
                setMessages([]);
                methods.setValue('msgs', [])
        }
    };

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

    const onSubmit = (data) => {
        dispatch(txCreateGroupProposal(
            {
                metadata: data?.metadata,
                admin: wallet?.address,
                proposers: [wallet?.address],
                messages: data?.msgs,
                groupPolicyAddress: policyAddress,
                chainId: chainInfo?.config?.chainId,
                rpc: chainInfo?.config?.rpc,
                denom: chainInfo?.config.currencies[0].coinMinimalDenom,
                feeAmount: data?.fees,
                memo: data?.memo,
                gas: data?.gas
            }
        ))
    };

    return (
        <Box component={'div'} sx={{ p: 2 }}>
            <Grid container>
                <Grid md={5} xs={12}>
                    <FormControl
                        sx={{
                            mt: 1,
                        }}
                        fullWidth
                    >
                        <InputLabel id="demo-simple-select-label">
                            Select Transaction
                        </InputLabel>
                        <Select
                            fullWidth
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

                    {txType && <FileProposalOptions
                        onFileContents={onFileContents}
                        txType={txType} /> || null}

                </Grid>
                <Grid p={4} mt={-25} md={7} xs={12}>
                    <Typography color="text.primary" variant="h6" fontWeight={600}>
                        Messages
                    </Typography>

                    <Box p={1}>

                        <FormProvider {...methods}>
                            <form onSubmit={handleSubmit(onSubmit)}>
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

                                {messages.length > 6 ? (
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
                                    <>
                                        <Controller
                                            name="metadata"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    sx={{
                                                        mt: 1
                                                    }}
                                                    {...field}
                                                    label="Proposal Metadata"
                                                    fullWidth
                                                />
                                            )}
                                        />
                                        <TxBasicFields
                                            chainInfo={chainInfo}
                                            setValue={setValue}
                                            control={control} />

                                        <Button
                                            type="submit"
                                            variant="contained"
                                            disableElevation
                                            sx={{
                                                mt: 2,
                                                textTransform: "none",
                                            }}
                                            disabled={createRes.status === "pending"}
                                        >
                                            {createRes.status === "pending"
                                                ? "Please wait..."
                                                : "Create"}
                                        </Button></>
                                ) : null}
                            </form>
                        </FormProvider>
                    </Box>
                </Grid>
            </Grid>

        </Box >
    )
}

export default AddFileTx;

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