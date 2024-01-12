import {
  CLOSE_ICON_PATH,
  DELEGATE_TYPE_URL,
  MULTISIG_DELEGATE_TEMPLATE,
  MULTISIG_REDELEGATE_TEMPLATE,
  MULTISIG_SEND_TEMPLATE,
  MULTISIG_TX_TYPES,
  MULTISIG_UNDELEGATE_TEMPLATE,
  NO_MESSAGES_ILLUSTRATION,
  REDELEGATE_TYPE_URL,
  SEND_TYPE_URL,
  UNDELEGATE_TYPE_URL,
} from '@/utils/constants';
import {
  CircularProgress,
  Dialog,
  DialogContent,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  SelectChangeEvent,
  TextField,
  Tooltip,
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
import {
  parseDelegateMsgsFromContent,
  parseReDelegateMsgsFromContent,
  parseSendMsgsFromContent,
  parseUnDelegateMsgsFromContent,
} from '@/utils/parseMsgs';
import ClearIcon from '@mui/icons-material/Clear';
import { dialogBoxPaperPropStyles } from '@/utils/commonStyles';

interface DialogCreateTxnProps {
  open: boolean;
  onClose: () => void;
  chainID: string;
  address: string;
  walletAddress: string;
}

const PER_PAGE = 6;

interface FileUploadProps {
  onFileContents: (content: string, type: string) => void;
  txType: string;
  resetMessages: () => void;
}

const FileUpload = (props: FileUploadProps) => {
  const { onFileContents, resetMessages, txType } = props;
  const [uploadedFileName, setUploadedFileName] = useState<string>('');

  return (
    <div className="">
      <div
        className="file-upload-box"
        onClick={() => {
          document.getElementById('multisig_file')!.click();
        }}
      >
        <div className="flex flex-col items-center justify-center">
          {uploadedFileName ? (
            <>
              <div className="font-bold">
                {uploadedFileName}{' '}
                <Tooltip title="Remove" placement="top">
                  <IconButton
                    aria-label="delete txn"
                    color="error"
                    onClick={(e) => {
                      setUploadedFileName('');
                      resetMessages();
                      e.stopPropagation();
                    }}
                  >
                    <ClearIcon />
                  </IconButton>
                </Tooltip>
              </div>
            </>
          ) : (
            <>
              <Image
                src="/file-upload-icon.svg"
                width={32}
                height={32}
                alt="Upload file"
                draggable={false}
              />
              <div className="mt-2">Upload file here</div>
            </>
          )}
        </div>
        <input
          id="multisig_file"
          accept=".csv"
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
              const contents = (e?.target?.result as string) || '';
              setUploadedFileName(file?.name);
              onFileContents(contents, txType);
            };
            reader.onerror = (e) => {
              alert(e);
            };
            reader.readAsText(file);
            e.target.value = '';
          }}
        />
      </div>
      <div className="mt-2 text-[14px] leading-normal font-light flex items-center">
        Download sample CSV file
        <a
          className="add-network-json-sample-link"
          onClick={() => {
            switch (txType) {
              case MULTISIG_TX_TYPES.send:
                window.open(
                  MULTISIG_SEND_TEMPLATE,
                  '_blank',
                  'noopener,noreferrer'
                );
                break;
              case MULTISIG_TX_TYPES.delegate:
                window.open(
                  MULTISIG_DELEGATE_TEMPLATE,
                  '_blank',
                  'noopener,noreferrer'
                );
                break;
              case MULTISIG_TX_TYPES.undelegate:
                window.open(
                  MULTISIG_UNDELEGATE_TEMPLATE,
                  '_blank',
                  'noopener,noreferrer'
                );
                break;
              case MULTISIG_TX_TYPES.redelegate:
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
          <Image
            src="/download-icon.svg"
            height={24}
            width={24}
            alt="download"
            draggable={false}
          />
        </a>
      </div>
    </div>
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
    setMessages([]);
    resetForm();
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

  const resetMessages = () => {
    setMessages([]);
  };

  useEffect(() => {
    resetMessages();
  }, [isFileUpload]);

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

  const {
    handleSubmit,
    control,
    reset: resetForm,
  } = useForm({
    defaultValues: {
      msgs: [],
      gas: 900000,
      memo: '',
      fees: feeAmount * 10 ** currency.coinDecimals,
    },
  });

  const onFileContents = (content: string, type: string) => {
    switch (type) {
      case MULTISIG_TX_TYPES.send: {
        const [parsedTxns, error] = parseSendMsgsFromContent(address, content);
        if (error) {
          dispatch(
            setError({
              type: 'error',
              message: error,
            })
          );
        } else {
          setMessages(parsedTxns);
        }
        break;
      }
      case MULTISIG_TX_TYPES.delegate: {
        const [parsedTxns, error] = parseDelegateMsgsFromContent(
          address,
          content
        );
        if (error) {
          dispatch(
            setError({
              type: 'error',
              message: error,
            })
          );
        } else {
          setMessages(parsedTxns);
        }
        break;
      }
      case MULTISIG_TX_TYPES.redelegate: {
        const [parsedTxns, error] = parseReDelegateMsgsFromContent(
          address,
          content
        );
        if (error) {
          dispatch(
            setError({
              type: 'error',
              message: error,
            })
          );
        } else {
          setMessages(parsedTxns);
        }
        break;
      }
      case MULTISIG_TX_TYPES.undelegate: {
        const [parsedTxns, error] = parseUnDelegateMsgsFromContent(
          address,
          content
        );
        if (error) {
          dispatch(
            setError({
              type: 'error',
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
    console.log('submission messages ========== ', messages)
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
        sx: dialogBoxPaperPropStyles,
      }}
    >
      <DialogContent sx={{ padding: 0 }}>
        <div className="w-[890px] text-white">
          <div className="px-10 pb-6 pt-10 flex justify-end">
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
                draggable={false}
              />
            </div>
          </div>
          <div className="mb-10 pl-6 pr-10 text-white flex h-full gap-6">
            <div className="flex-1 pl-6 pr-0 h-full">
              <div className="text-[20px] font-bold">Create Transaction</div>
              <SelectTransactionType
                onSelect={onSelect}
                isFileUpload={isFileUpload}
              />
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
              {isFileUpload ? (
                <FileUpload
                  onFileContents={(content: string, type: string) =>
                    onFileContents(content, type)
                  }
                  txType={txType}
                  resetMessages={resetMessages}
                />
              ) : (
                <>
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
                        setMessages([...messages, payload]);
                      }}
                      currency={currency}
                      availableBalance={availableBalance}
                    />
                  )}
                </>
              )}
            </div>
            <div className="border-l-[0.5px] border-[#ffffff2e]"></div>
            <div className="flex-1 h-full">
              <div className="text-[20px] font-bold mb-6">Messages</div>
              {messages.length ? (
                <div className="flex flex-col justify-between gap-6">
                  <div>
                    <div className="space-y-4 min-h-[236px] pb-4 border-b-[0.5px] border-[#ffffff2e]">
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

                    <div
                      className={
                        messages.length > PER_PAGE
                          ? 'mt-2 flex justify-end opacity-100'
                          : 'mt-2 flex justify-end opacity-0'
                      }
                    >
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
                  </div>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex gap-4">
                      <Controller
                        name="memo"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            className="bg-[#FFFFFF1A]"
                            {...field}
                            sx={{
                              ...createTxnTextFieldStyles,
                              ...{ mb: '0', mt: 3 },
                            }}
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

                    <button className="create-txn-form-btn mt-[42px] min-w-[130px] min-h-[44px]">
                      {createRes.status === 'pending' ? (
                        <CircularProgress size={18} sx={{ color: 'white' }} />
                      ) : (
                        'Create'
                      )}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="flex justify-center mt-[30%]">
                  <Image
                    src={NO_MESSAGES_ILLUSTRATION}
                    width={200}
                    height={177}
                    alt="No Messages"
                    draggable={false}
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
