import { AminoMsg } from '@cosmjs/amino';
import { AminoConverters } from '@cosmjs/stargate';
import { MsgCancelUnbondingDelegation } from 'cosmjs-types/cosmos/staking/v1beta1/tx';

export interface AminoCancelUnbonding extends AminoMsg {
  type: 'cosmos-sdk/MsgCancelUnbondingDelegation';
  value: {
    delegatorAddress: string;
    validatorAddress: string;
    amount: Coin;
    creationHeight: bigint;
  };
}

export const cancelUnbondingAminoConverter = (): AminoConverters => {
  return {
    '/cosmos.staking.v1beta1.MsgCancelUnbondingDelegation': {
        aminoType: 'cosmos-sdk/MsgCancelUnbondingDelegation',
        toAmino: ({
          delegatorAddress,
          validatorAddress,
          amount,
          creationHeight,
        }: MsgCancelUnbondingDelegation): AminoCancelUnbonding['value'] => {
          return {
            delegatorAddress,
            validatorAddress,
            amount,
            creationHeight,
          };
        },
        fromAmino: ({
          delegatorAddress,
          validatorAddress,
          amount,
          creationHeight,
        }: AminoCancelUnbonding['value']): MsgCancelUnbondingDelegation => {
          return {
            delegatorAddress,
            validatorAddress,
            amount,
            creationHeight,
          };
        },
      },
  }
};
