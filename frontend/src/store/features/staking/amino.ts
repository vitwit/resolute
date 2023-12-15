import { AminoMsg } from '@cosmjs/amino';
import { AminoConverters } from '@cosmjs/stargate';
import { MsgCancelUnbondingDelegation } from 'cosmjs-types/cosmos/staking/v1beta1/tx';

export interface AminoCancelUnbonding extends AminoMsg {
  type: 'cosmos-sdk/MsgCancelUnbondingDelegation';
  value: {
    delegator_address: string;
    validator_address: string;
    amount: Coin;
    creation_height: bigint;
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
            delegator_address: delegatorAddress,
            validator_address: validatorAddress,
            amount,
            creation_height: creationHeight,
          };
        },
        fromAmino: ({
          delegator_address,
          validator_address,
          amount,
          creation_height,
        }: AminoCancelUnbonding['value']): MsgCancelUnbondingDelegation => {
          return {
            delegatorAddress: delegator_address,
            validatorAddress: validator_address,
            amount,
            creationHeight: creation_height,
          };
        },
      },
  }
};
