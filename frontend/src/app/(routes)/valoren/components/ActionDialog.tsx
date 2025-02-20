import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  TextField,
  MenuItem,
  FormControl,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import {
  customSelectStyles,
  dialogBoxPaperPropStyles,
} from '@/utils/commonStyles';
import CustomButton from '@/components/common/CustomButton';
import useStaking from '@/custom-hooks/txn-builder/useStaking';
import CustomAutoComplete from '@/components/txn-builder/components/CustomAutoComplete';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { TxStatus } from '@/types/enums';
import { customMUITextFieldStyles } from '../../multiops/styles';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import {
  ActionType,
  RegisterActionPayload,
} from '@/store/features/valoren/valorenService';
import {
  getUserActions,
  registerAction,
  resetRegisterActionRes,
} from '@/store/features/valoren/valorenSlice';
import { setError } from '@/store/features/common/commonSlice';

interface ActionDialogProps {
  open: boolean;
  onClose: () => void;
  chainID: string;
}

const ActionDialog: React.FC<ActionDialogProps> = ({
  open,
  onClose,
  chainID,
}) => {
  const dispatch = useAppDispatch();
  const { getDenomInfo, getChainInfo } = useGetChainInfo();
  const { minimalDenom, decimals, displayDenom } = getDenomInfo(chainID);
  const { address, cosmosAddress } = getChainInfo(chainID);
  const [actionType, setActionType] = useState<string>('restake');
  const { getValidatorsForUndelegation, getValidators } = useStaking();
  const { delegatedValidators } = getValidatorsForUndelegation({ chainID });
  const { validatorsList } = getValidators({ chainID });

  const [selectedOption, setSelectedOption] = useState<ValidatorOption | null>(
    null
  );
  const [selectedSourceValidator, setSelectedSourceValidator] =
    useState<ValidatorOption | null>(null);
  const [selectedDestValidator, setSelectedDestValidator] =
    useState<ValidatorOption | null>(null);

  const validatorsLoading = useAppSelector(
    (state) => state.staking.chains?.[chainID]?.validators.status
  );
  const registerActionStatus = useAppSelector(
    (state) => state.valoren.registerActionRes.status
  );

  const handleActionTypeChange = (event: SelectChangeEvent<string>) => {
    const selectedAction = event.target.value;
    setActionType(selectedAction);
  };
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      interval: {
        days: '30',
      },
      amount: '',
      validatorAddress: '',
      sourceValidator: '',
      destinationValidator: '',
    },
    mode: 'onChange',
  });

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const handleRegister = async (data: any) => {
    console.log(data);
    const payload: RegisterActionPayload = {
      user_id: address,
      chain_id: chainID,
      type: actionType as ActionType,
      interval: parseInt(data.interval.days, 10) * 86400,
      payload: {},
    };

    if (actionType === 'restake') {
      payload.payload = {
        typeUrl: '/cosmos.staking.v1beta1.MsgDelegate',
        value: {
          delegatorAddress: address,
          amount: {
            denom: minimalDenom,
            amount: (
              parseFloat(data.amount) * Math.pow(10, decimals)
            ).toString(),
          },
          validatorAddress: data.validatorAddress,
        },
      };
    } else if (actionType === 'redelegate') {
      payload.payload = {
        typeUrl: '/cosmos.staking.v1beta1.MsgBeginRedelegate',
        value: {
          sourceValidatorAddress: data.sourceValidator,
          destinationValidatorAddress: data.destinationValidator,
        },
      };
    }

    dispatch(registerAction({ cosmosAddress, payload }));
  };

  const handleValidatorChange = (option: ValidatorOption | null) => {
    setValue('validatorAddress', option?.address || '', {
      shouldValidate: true,
    });
    setSelectedOption(option);
  };

  const handleSrcValidatorChange = (option: ValidatorOption | null) => {
    setValue('sourceValidator', option?.address || '', {
      shouldValidate: true,
    });
    setSelectedSourceValidator(option);
  };

  const handleDestValidatorChange = (option: ValidatorOption | null) => {
    setValue('destinationValidator', option?.address || '', {
      shouldValidate: true,
    });
    setSelectedDestValidator(option);
  };

  useEffect(() => {
    if (registerActionStatus === TxStatus.IDLE) {
      dispatch(
        setError({
          type: 'success',
          message: 'Action registered successfully',
        })
      );
      onClose();
      dispatch(getUserActions(address));
    }
  }, [registerActionStatus]);

  useEffect(() => {
    return () => {
      dispatch(resetRegisterActionRes());
    };
  }, []);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      sx={{
        '& .MuiDialog-paper': {
          color: 'white',
        },
      }}
      PaperProps={{
        sx: dialogBoxPaperPropStyles,
      }}
    >
      <DialogContent sx={{ padding: 0 }}>
        <div className={`px-4 pt-4 pb-6 space-y-10 w-[890px] text-white`}>
          <div className="flex justify-end px-6">
            <button onClick={onClose} className="text-btn !h-8">
              Close
            </button>
          </div>
          <div className="flex items-center flex-col gap-2">
            <div className="flex gap-2 items-center px-6">
              <div className="text-h1 w-full text-center ">Register Action</div>
            </div>
            <div className="text-b1-light text-center w-full">
              Register Action
            </div>
            <div className="px-6 w-full">
              <div className="divider-line"></div>
            </div>
          </div>
          <div className="px-6">
            <form
              onSubmit={handleSubmit(handleRegister)}
              className="flex flex-col gap-4"
            >
              {/* Action Type */}
              <div className="flex gap-6">
                <div className="flex-1 space-y-2">
                  <div className="text-b1-light">Select Action</div>
                  <FormControl
                    fullWidth
                    sx={{
                      '& .MuiFormLabel-root': {
                        display: 'none',
                      },
                    }}
                  >
                    <Select
                      labelId="action-type"
                      className="bg-transparent border-[1px] border-[#ffffff14]"
                      id="action-type"
                      value={actionType}
                      onChange={handleActionTypeChange}
                      fullWidth
                      sx={{
                        ...customSelectStyles,
                        '& .MuiSelect-select': {
                          color: '#fffffff0',
                        },
                      }}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            backgroundColor: '#FFFFFF14',
                            backdropFilter: 'blur(15px)',
                            color: '#fffffff0',
                            borderRadius: '16px',
                            marginTop: '8px',
                          },
                        },
                      }}
                    >
                      <MenuItem value="restake">Restake</MenuItem>
                      <MenuItem value="redelegate">Redelegate</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className="flex-1 space-y-2">
                  <div className="text-b1-light">Interval (In Days)</div>
                  <Controller
                    name="interval.days"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <div className="space-y-1">
                        <TextField
                          type="number"
                          inputProps={{ min: 1, max: 31 }}
                          className="bg-transparent rounded-full border-[1px] border-[#ffffff80] h-10 w-28"
                          {...field}
                          sx={{
                            ...customMUITextFieldStyles,
                          }}
                          placeholder="Days"
                          fullWidth
                          required
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
                        {error && (
                          <span className="text-red-500 text-xs">
                            {error.message}
                          </span>
                        )}
                      </div>
                    )}
                  />
                </div>
              </div>

              {/* Payload Fields */}
              {actionType === 'restake' && (
                <>
                  {/* Select Validator */}
                  <div className="flex-1 space-y-2">
                    <div className="text-b1-light">Select Validator</div>
                    <Controller
                      name="validatorAddress"
                      control={control}
                      rules={{
                        required: 'Please select a validator',
                      }}
                      render={({ fieldState: { error } }) => (
                        <div className="space-y-1">
                          <CustomAutoComplete
                            dataLoading={validatorsLoading === TxStatus.PENDING}
                            handleChange={handleValidatorChange}
                            options={delegatedValidators}
                            selectedOption={selectedOption}
                            name="Validator"
                            emptyText="No Delegations"
                          />
                          <div>
                            <span
                              className={
                                error ? 'error-chip opacity-80' : 'hidden'
                              }
                            >
                              {error?.message}
                            </span>
                          </div>
                        </div>
                      )}
                    />
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="text-b1-light">Min Reward Amount</div>
                    <Controller
                      name="amount"
                      control={control}
                      rules={{
                        required: 'Amount is required',
                        validate: (value) => {
                          const amount = Number(value);
                          if (isNaN(amount) || amount <= 0)
                            return 'Invalid Amount';
                        },
                      }}
                      render={({ field }) => (
                        <TextField
                          className="bg-transparent rounded-full border-[1px] border-[#ffffff80] h-10"
                          {...field}
                          sx={{
                            ...customMUITextFieldStyles,
                          }}
                          required
                          inputProps={{ min: 0 }}
                          placeholder="Enter amount"
                          fullWidth
                          InputProps={{
                            sx: {
                              input: {
                                color: 'white',
                                fontSize: '14px',
                                padding: 2,
                              },
                            },
                            endAdornment: (
                              <div className="text-b1-light">
                                {displayDenom}
                              </div>
                            ),
                          }}
                        />
                      )}
                    />
                    <div>
                      <span
                        className={
                          !!errors.amount ? 'error-chip opacity-80' : 'hidden'
                        }
                      >
                        {errors.amount?.message}
                      </span>
                    </div>
                  </div>
                </>
              )}

              {actionType === 'redelegate' && (
                <>
                  <div className="flex-1 space-y-2">
                    <div className="text-b1-light">Source Validator</div>
                    <Controller
                      name="sourceValidator"
                      control={control}
                      rules={{
                        required: 'Please select a source validator',
                      }}
                      render={({ fieldState: { error } }) => (
                        <div className="space-y-1">
                          <CustomAutoComplete
                            dataLoading={validatorsLoading === TxStatus.PENDING}
                            handleChange={handleSrcValidatorChange}
                            options={delegatedValidators}
                            selectedOption={selectedSourceValidator}
                            name="Source"
                            emptyText="No Delegations"
                          />
                          <div>
                            <span
                              className={
                                error ? 'error-chip opacity-80' : 'hidden'
                              }
                            >
                              {error?.message}
                            </span>
                          </div>
                        </div>
                      )}
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="text-b1-light">Destination Validator</div>
                    <Controller
                      name="destinationValidator"
                      control={control}
                      rules={{
                        required: 'Please select a destination validator',
                      }}
                      render={({ fieldState: { error } }) => (
                        <div className="space-y-1">
                          <CustomAutoComplete
                            dataLoading={validatorsLoading === TxStatus.PENDING}
                            handleChange={handleDestValidatorChange}
                            options={validatorsList}
                            selectedOption={selectedDestValidator}
                            name="Destination"
                            emptyText="No Validators"
                          />
                          <div>
                            <span
                              className={
                                error ? 'error-chip opacity-80' : 'hidden'
                              }
                            >
                              {error?.message}
                            </span>
                          </div>
                        </div>
                      )}
                    />
                  </div>
                </>
              )}

              <CustomButton
                btnText="Register"
                btnType="submit"
                btnLoading={registerActionStatus === TxStatus.PENDING}
                btnDisabled={registerActionStatus === TxStatus.PENDING}
              />
            </form>
          </div>
          <div className="h-10"></div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ActionDialog;
