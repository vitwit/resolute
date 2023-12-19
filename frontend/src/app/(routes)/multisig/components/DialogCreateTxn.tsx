import {
  CLOSE_ICON_PATH,
  DELEGATE_TYPE_URL,
  MULTISIG_DELEGATE_TEMPLATE,
  MULTISIG_REDELEGATE_TEMPLATE,
  MULTISIG_SEND_TEMPLATE,
  MULTISIG_TX_TYPES,
  MULTISIG_UNDELEGATE_TEMPLATE,
  REDELEGATE_TYPE_URL,
  SEND_TYPE_URL,
  UNDELEGATE_TYPE_URL,
} from '@/utils/constants';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Send from './txns/Send';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { parseBalance } from '@/utils/denom';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import { paginationComponentStyles } from '../../staking/styles';
import { Controller, useForm } from 'react-hook-form';
import { getAuthToken } from '@/utils/localStorage';
import { fee } from '@/txns/execute';
import {
  createTxn,
  resetCreateTxnState,
} from '@/store/features/multisig/multisigSlice';
import Delegate from './txns/Delegate';
import { resetError, setError } from '@/store/features/common/commonSlice';
import { createTxnTextFieldStyles, selectTxnStyles } from '../styles';
import SendMessage from './msgs/SendMessage';
import DelegateMessage from './msgs/DelegateMessage';
import UndelegateMessage from './msgs/UndelegateMessage';
import RedelegateMessage from './msgs/RedelegateMessage';
import SelectTransactionType from './SelectTransactionType';
import UnDelegate from './txns/UnDelegate';
import ReDelegate from './txns/ReDelegate';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { parseDelegateMsgsFromContent, parseReDelegateMsgsFromContent, parseSendMsgsFromContent, parseUnDelegateMsgsFromContent } from '@/utils/parseMsgs';

interface DialogCreateTxnProps {
  open: boolean;
  onClose: () => void;
  chainID: string;
  address: string;
  walletAddress: string;
}

const PER_PAGE = 5;
const TYPE_SEND = 'SEND';
const TYPE_DELEGATE = 'DELEGATE';
const TYPE_UNDELEGATE = 'UNDELEGATE';
const TYPE_REDELEGATE = 'REDELEGATE';

interface FileUploadProps {
  onFileContents: (content: string, type: string) => void;
}

const FileUpload = (props: FileUploadProps) => {
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
          textTransform: 'none',
        }}
        onClick={() => {
          switch (txType) {
            case TYPE_SEND:
              window.open(
                MULTISIG_SEND_TEMPLATE,
                '_blank',
                'noopener,noreferrer'
              );
              break;
            case TYPE_DELEGATE:
              window.open(
                MULTISIG_DELEGATE_TEMPLATE,
                '_blank',
                'noopener,noreferrer'
              );
              break;
            case TYPE_UNDELEGATE:
              window.open(
                MULTISIG_UNDELEGATE_TEMPLATE,
                '_blank',
                'noopener,noreferrer'
              );
              break;
            case TYPE_REDELEGATE:
              window.open(
                MULTISIG_REDELEGATE_TEMPLATE,
                '_blank',
                'noopener,noreferrer'
              );
              break;
            default:
              alert('unknown message type');
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
          textTransform: 'none',
        }}
        onClick={() => {
          const element = document.getElementById('multisig_file');
          if (element) {
            element.click();
          }
        }}
      >
        <input
          id="multisig_file"
          accept="*.csv"
          hidden
          type="file"
          onChange={(e) => {
            const files = e.target.files;
            if (!files) {
              return;
            }
            const file = files[0];
            if (!file) {
              return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
              const contents = e?.target?.result as string || "";
              props.onFileContents(contents, txType);
            };
            reader.onerror = (e) => {
              alert(e);
            };
            reader.readAsText(file);
            e.target.value = '';
          }}
        />
        Upload csv file
      </Button>
    </Box>
  );
};

const DialogCreateTxn: React.FC<DialogCreateTxnProps> = (props) => {
  const { open, onClose, chainID, address, walletAddress } = props;
  const [isFileUpload, setIsFileUpload] = useState<boolean>(false);
  const [txType, setTxType] = useState('Send');
  const [messages, setMessages] = useState<Msg[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [slicedMsgs, setSlicedMsgs] = useState<Msg[]>([]);
  const [availableBalance, setAvailableBalance] = useState(0);

  const dispatch = useAppDispatch();

  const balance = useAppSelector(
    (state: RootState) => state.multisig.balance.balance
  );
  const createRes = useAppSelector(
    (state: RootState) => state.multisig.createTxnRes
  );

  const handleClose = () => {
    onClose();
  };

  const onSelect = (value: boolean) => {
    setIsFileUpload(value);
  };

  const handleTypeChange = (event: SelectChangeEvent<string>) => {
    setTxType(event.target.value);
  };

  const { getDenomInfo, getChainInfo } = useGetChainInfo();
  const { feeAmount, baseURL } = getChainInfo(chainID);
  const { decimals, displayDenom, minimalDenom } = getDenomInfo(chainID);
  const currency = {
    coinDenom: displayDenom,
    coinDecimals: decimals,
    coinMinimalDenom: minimalDenom,
  };

  useEffect(() => {
    if (balance) {
      setAvailableBalance(
        parseBalance(
          [balance],
          currency.coinDecimals,
          currency.coinMinimalDenom
        )
      );
    }
  }, [balance]);

  useEffect(() => {
    if (messages.length < PER_PAGE) {
      setSlicedMsgs(messages);
    } else {
      setCurrentPage(1);
      setSlicedMsgs(messages?.slice(0, 1 * PER_PAGE));
    }
  }, [messages]);

  useEffect(() => {
    if (createRes?.status === 'rejected') {
      dispatch(
        setError({
          type: 'error',
          message: createRes?.error,
        })
      );
    } else if (createRes?.status === 'idle') {
      handleClose();
      dispatch(
        setError({
          type: 'success',
          message: 'Transaction created',
        })
      );
    }
  }, [createRes]);

  useEffect(() => {
    return () => {
      dispatch(resetError());
      dispatch(resetCreateTxnState());
    };
  }, []);

  const renderMessage = (
    msg: Msg,
    index: number,
    currency: Currency,
    onDelete: (index: number) => void
  ) => {
    switch (msg.typeUrl) {
      case SEND_TYPE_URL:
        return SendMessage({ msg, index, currency, onDelete });
      case DELEGATE_TYPE_URL:
        return DelegateMessage({ msg, index, currency, onDelete });
      case UNDELEGATE_TYPE_URL:
        return UndelegateMessage({ msg, index, currency, onDelete });
      case REDELEGATE_TYPE_URL:
        return RedelegateMessage({ msg, index, currency, onDelete });
      default:
        return '';
    }
  };

  const onDeleteMsg = (index: number) => {
    const arr = messages.filter((_, i) => i !== index);
    setMessages(arr);
  };

  const { handleSubmit, control } = useForm({
    defaultValues: {
      msgs: [],
      gas: 900000,
      memo: '',
      fees: feeAmount * 10 ** currency.coinDecimals,
    },
  });

  const onFileContents = (content: string, type: string) => {
    console.log(content, type)
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
        }
        console.log(parsedTxns, error)
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
        }
        break;
      }
      default:
        setMessages([]);
    }
  };

  const onSubmit = (data: {
    msgs: never[];
    gas: number;
    memo: string;
    fees: number;
  }) => {
    const feeObj = fee(
      currency.coinMinimalDenom,
      data.fees.toString(),
      data.gas
    );
    const authToken = getAuthToken(chainID);
    dispatch(
      createTxn({
        data: {
          address: address,
          chain_id: chainID,
          messages: messages,
          fee: feeObj,
          memo: data.memo,
          gas: data.gas,
        },
        queryParams: {
          address: walletAddress,
          signature: authToken?.signature || '',
        },
      })
    );
  };

  return (
    <Dialog
      open={open}
      onClose={() => handleClose()}
      maxWidth="lg"
      PaperProps={{
        sx: {
          borderRadius: '24px',
          background: 'linear-gradient(90deg, #1F184E 27.66%, #8B3DA7 99.91%)',
        },
      }}
    >
      <DialogContent sx={{ padding: 0 }}>
        <div className="w-[890px] min-h-[610px] text-white">
          <div className="px-10 py-6 flex justify-end">
            <div
              onClick={() => {
                handleClose();
              }}
            >
              <Image
                className="cursor-pointer"
                src={CLOSE_ICON_PATH}
                width={24}
                height={24}
                alt="Close"
              />
            </div>
          </div>
          <div className="mt-6 mb-[72px] pl-6 pr-10 text-white flex h-full gap-6">
            <div className="flex-1 px-6 h-full border-r-[0.5px] border-[#ffffff2e]">
              <div className="text-[20px] font-bold">Create Transaction</div>
              <SelectTransactionType
                onSelect={onSelect}
                isFileUpload={isFileUpload}
              />
              {isFileUpload ? (
                <FileUpload
                  onFileContents={(content: string, type: string) =>
                    onFileContents(content, type)
                  }
                />
              ) : (
                <>
                  <FormControl
                    fullWidth
                    sx={{
                      '& .MuiFormLabel-root': {
                        display: 'none',
                      },
                    }}
                  >
                    <InputLabel className="text-white" id="tx-type">
                      Select Transaction
                    </InputLabel>
                    <Select
                      labelId="tx-type"
                      className="bg-[#FFFFFF1A]"
                      id="tx-type"
                      value={txType}
                      label="Select Transaction"
                      onChange={(e) => handleTypeChange(e)}
                      sx={selectTxnStyles}
                    >
                      <MenuItem value={MULTISIG_TX_TYPES.send}>Send</MenuItem>
                      <MenuItem value={MULTISIG_TX_TYPES.delegate}>
                        Delegate
                      </MenuItem>
                      <MenuItem value={MULTISIG_TX_TYPES.redelegate}>
                        Redelegate
                      </MenuItem>
                      <MenuItem value={MULTISIG_TX_TYPES.undelegate}>
                        Undelegate
                      </MenuItem>
                    </Select>
                  </FormControl>
                  {txType === MULTISIG_TX_TYPES.send && (
                    <Send
                      address={address}
                      onSend={(payload) => {
                        setMessages([...messages, payload]);
                      }}
                      currency={currency}
                      availableBalance={availableBalance}
                    />
                  )}
                  {txType === MULTISIG_TX_TYPES.delegate && (
                    <Delegate
                      chainID={chainID}
                      address={address}
                      onDelegate={(payload) => {
                        setMessages([...messages, payload]);
                      }}
                      currency={currency}
                      availableBalance={availableBalance}
                    />
                  )}
                  {txType === MULTISIG_TX_TYPES.undelegate && (
                    <UnDelegate
                      chainID={chainID}
                      address={address}
                      baseURL={baseURL}
                      onDelegate={(payload) => {
                        console.log('payload', payload);
                        setMessages([...messages, payload]);
                      }}
                      currency={currency}
                      availableBalance={availableBalance}
                    />
                  )}
                  {txType === MULTISIG_TX_TYPES.redelegate && (
                    <ReDelegate
                      chainID={chainID}
                      address={address}
                      baseURL={baseURL}
                      onDelegate={(payload) => {
                        console.log('payload', payload);
                        setMessages([...messages, payload]);
                      }}
                      currency={currency}
                      availableBalance={availableBalance}
                    />
                  )}
                </>
              )}
            </div>
            <div className="flex-1 h-full">
              <div className="text-[20px] font-bold mb-6">Messages</div>
              {messages.length ? (
                <div className="flex flex-col justify-between gap-6">
                  <div>
                    <div className="space-y-4 min-h-[196px] pb-4 border-b-[0.5px] border-[#ffffff2e]">
                      {slicedMsgs.map((msg, index) => {
                        return (
                          <div key={index + PER_PAGE * (currentPage - 1)}>
                            {renderMessage(
                              msg,
                              index + PER_PAGE * (currentPage - 1),
                              currency,
                              onDeleteMsg
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {messages.length > 0 ? (
                      <div className="mt-2 flex justify-end">
                        <Pagination
                          sx={paginationComponentStyles}
                          count={Math.ceil(messages.length / PER_PAGE)}
                          shape="circular"
                          onChange={(_, v) => {
                            setCurrentPage(v);
                            setSlicedMsgs(
                              messages?.slice((v - 1) * PER_PAGE, v * PER_PAGE)
                            );
                          }}
                        />
                      </div>
                    ) : null}
                  </div>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex gap-4">
                      <Controller
                        name="gas"
                        control={control}
                        rules={{ required: 'Gas is required' }}
                        render={({ field, fieldState: { error } }) => (
                          <TextField
                            className="bg-[#FFFFFF1A]"
                            {...field}
                            sx={createTxnTextFieldStyles}
                            error={!!error}
                            size="small"
                            helperText={error ? error.message : null}
                            type="number"
                            required
                            placeholder="Gas"
                            fullWidth
                            InputProps={{
                              sx: {
                                input: {
                                  color: 'white',
                                  fontSize: '14px',
                                  padding: 2,
                                },
                              },
                            }}
                          />
                        )}
                      />
                      <Controller
                        name="memo"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            className="bg-[#FFFFFF1A]"
                            {...field}
                            sx={createTxnTextFieldStyles}
                            placeholder="Memo"
                            fullWidth
                            InputProps={{
                              sx: {
                                input: {
                                  color: 'white',
                                  fontSize: '14px',
                                  padding: 2,
                                },
                              },
                            }}
                          />
                        )}
                      />
                    </div>

                    <button className="create-txn-form-btn mt-6">
                      {createRes.status === 'pending'
                        ? 'Please wait...'
                        : 'Create'}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="flex justify-center mt-20">
                  <Image
                    src="/empty-messages-image.png"
                    width={200}
                    height={200}
                    alt="No Messages"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogCreateTxn;
