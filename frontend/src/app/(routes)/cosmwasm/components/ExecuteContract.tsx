import useContracts from '@/custom-hooks/useContracts';
import { CircularProgress, SelectChangeEvent, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import AttachFunds from './AttachFunds';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { TxStatus } from '@/types/enums';
import { executeContract } from '@/store/features/cosmwasm/cosmwasmSlice';
import { getFormattedFundsList } from '@/utils/util';
import { queryInputStyles } from '../styles';
import { setError } from '@/store/features/common/commonSlice';
import ExecuteContractInputs from './ExecuteContractInputs';

interface ExecuteContractI {
  address: string;
  baseURLs: string[];
  chainID: string;
  rpcURLs: string[];
  walletAddress: string;
  chainName: string;
}

const ExecuteContract = (props: ExecuteContractI) => {
  const { address, baseURLs, chainID, rpcURLs, walletAddress, chainName } =
    props;

  // ------------------------------------------//
  // ---------------DEPENDENCIES---------------//
  // ------------------------------------------//
  const dispatch = useAppDispatch();
  const {
    getExecutionOutput,
    getExecuteMessages,
    executeMessagesError,
    executeMessagesLoading,
    getExecuteMessagesInputs,
    executeInputsError,
    executeInputsLoading,
  } = useContracts();
  const { getDenomInfo } = useGetChainInfo();
  const { decimals, minimalDenom } = getDenomInfo(chainID);

  // ------------------------------------------//
  // ------------------STATES------------------//
  // ------------------------------------------//
  const [executeInput, setExecuteInput] = useState('');
  const [attachFundType, setAttachFundType] = useState('no-funds');
  const [funds, setFunds] = useState<FundInfo[]>([
    {
      amount: '',
      denom: minimalDenom,
      decimals: decimals,
    },
  ]);
  const [fundsInput, setFundsInput] = useState('');
  const [executeMessages, setExecuteMessages] = useState<string[]>([]);
  const [selectedMessage, setSelectedMessage] = useState('');
  const [executeMessageInputs, setExecuteMessageInputs] = useState<string[]>(
    []
  );

  const txExecuteLoading = useAppSelector(
    (state) => state.cosmwasm.chains?.[chainID].txExecute.status
  );

  // ------------------------------------------------//
  // -----------------CHANGE HANDLERS----------------//
  // ------------------------------------------------//
  const handleExecuteInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setExecuteInput(e.target.value);
  };

  const handleAttachFundTypeChange = (event: SelectChangeEvent<string>) => {
    setAttachFundType(event.target.value);
  };

  const handleSelectMessage = async (msg: string) => {
    setExecuteInput(`{\n\t"${msg}": {}\n}`);
    setSelectedMessage(msg);
    const { messages } = await getExecuteMessagesInputs({
      chainID,
      contractAddress: address,
      rpcURLs,
      msg: { [msg]: {} },
      msgName: msg,
    });
    setExecuteMessageInputs(messages);
  };

  const handleSelectedMessageInputChange = (value: string) => {
    setExecuteInput(
      JSON.stringify(
        {
          [selectedMessage]: {
            [value]: '',
          },
        },
        undefined,
        2
      )
    );
  };

  // ----------------------------------------------------//
  // -----------------CUSTOM VALIDATIONS-----------------//
  // ----------------------------------------------------//
  const validateJSONInput = (
    input: string,
    setInput: React.Dispatch<React.SetStateAction<string>>,
    errorMessagePrefix: string
  ): boolean => {
    try {
      if (!input?.length) {
        dispatch(
          setError({
            type: 'error',
            message: `Please enter ${errorMessagePrefix}`,
          })
        );
        return false;
      }
      const parsed = JSON.parse(input);
      const formattedJSON = JSON.stringify(parsed, undefined, 4);
      setInput(formattedJSON);
      return true;
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    } catch (error: any) {
      dispatch(
        setError({
          type: 'error',
          message: `Invalid JSON input: (${errorMessagePrefix}) ${error?.message || ''}`,
        })
      );
      return false;
    }
  };

  const formatExecutionMessage = () => {
    return validateJSONInput(
      executeInput,
      setExecuteInput,
      'Execution Message'
    );
  };

  const validateFunds = () => {
    return validateJSONInput(fundsInput, setFundsInput, 'Attach Funds List');
  };

  // ------------------------------------------//
  // ---------------TRANSACTION----------------//
  // ------------------------------------------//
  const onExecute = async (input: string) => {
    if (!input?.length) {
      dispatch(
        setError({
          type: 'error',
          message: 'Please enter execution message',
        })
      );
      return;
    }
    if (!formatExecutionMessage()) return;
    if (attachFundType === 'json' && !validateFunds()) return;

    const attachedFunds = getFormattedFundsList(
      funds,
      fundsInput,
      attachFundType
    );

    dispatch(
      executeContract({
        chainID,
        contractAddress: address,
        msgs: input,
        rpcURLs,
        walletAddress,
        funds: attachedFunds,
        baseURLs,
        getExecutionOutput,
      })
    );
  };

  // ------------------------------------------//
  // ---------------SIDE EFFECT----------------//
  // ------------------------------------------//
  useEffect(() => {
    const fetchMessages = async () => {
      const { messages } = await getExecuteMessages({
        chainID,
        contractAddress: address,
        rpcURLs,
      });
      setExecuteMessages(messages);
    };
    fetchMessages();
  }, [address]);

  return (
    <div className="grid grid-cols-2 gap-10">
      <ExecuteContractInputs
        executeInput={executeInput}
        executeInputsError={executeInputsError}
        executeInputsLoading={executeInputsLoading}
        executeMessageInputs={executeMessageInputs}
        executeMessages={executeMessages}
        executionLoading={txExecuteLoading}
        formatJSON={formatExecutionMessage}
        handleExecuteInputChange={handleExecuteInputChange}
        handleSelectMessage={handleSelectMessage}
        handleSelectedMessageInputChange={handleSelectedMessageInputChange}
        messagesError={executeMessagesError}
        messagesLoading={executeMessagesLoading}
        onExecute={onExecute}
        selectedMessage={selectedMessage}
      />
      <div className="execute-output-box">
        <div className="attach-funds-header">
          <div className="text-[18px] font-bold">Attach Funds</div>
          <div className="attach-funds-description">
            Provide the list of funds you would like to attach.
          </div>
        </div>
        <div className="flex-1 overflow-y-scroll">
          <AttachFunds
            handleAttachFundTypeChange={handleAttachFundTypeChange}
            attachFundType={attachFundType}
            chainName={chainName}
            funds={funds}
            setFunds={setFunds}
            fundsInputJson={fundsInput}
            setFundsInputJson={setFundsInput}
          />
        </div>
      </div>
    </div>
  );
};

export default ExecuteContract;
