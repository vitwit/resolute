import useContracts from '@/custom-hooks/useContracts';
import { CircularProgress, SelectChangeEvent, TextField } from '@mui/material';
import React, { useState } from 'react';
import AttachFunds from './AttachFunds';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { TxStatus } from '@/types/enums';
import { executeContract } from '@/store/features/cosmwasm/cosmwasmSlice';
import { getFormattedFundsList } from '@/utils/util';
import { queryInputStyles } from '../styles';
import { setError } from '@/store/features/common/commonSlice';

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
  const { getExecutionOutput } = useContracts();
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

  const txExecuteLoading = useAppSelector(
    (state) => state.cosmwasm.chains?.[chainID].txExecute.status
  );

  // ------------------------------------------------//
  // -----------------CHANGE HANDLERS----------------//
  // ------------------------------------------------//
  const handleQueryChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setExecuteInput(e.target.value);
  };

  const handleAttachFundTypeChange = (event: SelectChangeEvent<string>) => {
    setAttachFundType(event.target.value);
  };

  const formatJSON = () => {
    try {
      const parsed = JSON.parse(executeInput);
      const formattedJSON = JSON.stringify(parsed, undefined, 4);
      setExecuteInput(formattedJSON);
      return true;
      /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
      dispatch(
        setError({
          type: 'error',
          message: 'Invalid JSON input: ' + (error?.message || ''),
        })
      );
    }
    return false;
  };

  // ------------------------------------------//
  // ---------------TRANSACTION----------------//
  // ------------------------------------------//
  const onExecute = async () => {
    if (!executeInput?.length) {
      dispatch(
        setError({
          type: 'error',
          message: 'Please enter query message',
        })
      );
      return;
    }
    if (!formatJSON()) {
      return;
    }

    const attachedFunds = getFormattedFundsList(
      funds,
      fundsInput,
      attachFundType
    );

    dispatch(
      executeContract({
        chainID,
        contractAddress: address,
        msgs: executeInput,
        rpcURLs,
        walletAddress,
        funds: attachedFunds,
        baseURLs,
        getExecutionOutput,
      })
    );
  };

  return (
    <div className="flex gap-10">
      <div className="execute-field-wrapper">
        <div className="execute-input-field">
          <TextField
            value={executeInput}
            name="executeInputsField"
            onChange={handleQueryChange}
            fullWidth
            multiline
            rows={7}
            InputProps={{
              sx: {
                input: {
                  color: 'white',
                  fontSize: '14px',
                  padding: 2,
                },
              },
            }}
            sx={queryInputStyles}
          />
          <button onClick={onExecute} className="primary-gradient execute-btn">
            {txExecuteLoading === TxStatus.PENDING ? (
              <CircularProgress size={18} sx={{ color: 'white' }} />
            ) : (
              'Execute'
            )}
          </button>
          <button
            onClick={formatJSON}
            className="format-json-btn !bg-[#232034]"
          >
            Format JSON
          </button>
        </div>
      </div>
      <div className="execute-output-box">
        <div className="attach-funds-header">
          <div className="text-[18px] font-bold">Attach Funds</div>
          {/* TODO: Update the dummy description */}
          <div className="attach-funds-description">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Necessitatibus fuga consectetur reiciendis fugit suscipit ab.
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
