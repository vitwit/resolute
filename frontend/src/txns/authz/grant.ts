import { Timestamp } from 'cosmjs-types/google/protobuf/timestamp';
import { SendAuthorization } from 'cosmjs-types/cosmos/bank/v1beta1/authz';
import { Coin } from 'cosmjs-types/cosmos/base/v1beta1/coin';
import { MsgGrant } from 'cosmjs-types/cosmos/authz/v1beta1/tx';
import { fromRfc3339WithNanoseconds } from '@cosmjs/tendermint-rpc';
import { GenericAuthorization } from 'cosmjs-types/cosmos/authz/v1beta1/authz';
import {
  StakeAuthorization,
  AuthorizationType,
  StakeAuthorization_Validators,
} from 'cosmjs-types/cosmos/staking/v1beta1/authz';

const msgAuthzGrantTypeUrl = '/cosmos.authz.v1beta1.MsgGrant';

export function AuthzSendGrantMsg(
  granter: string,
  grantee: string,
  denom: string,
  spendLimit: number,
  expiration: string
): Msg {
  const expWithNano = fromRfc3339WithNanoseconds(expiration);
  const expSec = Math.floor(expWithNano.getTime() / 1000);
  const expNano =
    (expWithNano.getTime() % 1000) * 1000000 + (expWithNano.nanoseconds ?? 0);
  const exp = Timestamp.fromPartial({
    nanos: expNano,
    seconds: BigInt(expSec),
  });

  const sendAuthValue = SendAuthorization.encode(
    SendAuthorization.fromPartial({
      spendLimit: [
        Coin.fromPartial({
          amount: String(spendLimit),
          denom: denom,
        }),
      ],
    })
  ).finish();
  const grantValue = MsgGrant.fromPartial({
    grant: {
      authorization: {
        typeUrl: '/cosmos.bank.v1beta1.SendAuthorization',
        value: sendAuthValue,
      },
      expiration: exp,
    },
    grantee: grantee,
    granter: granter,
  });

  return {
    typeUrl: msgAuthzGrantTypeUrl,
    value: grantValue,
  };
}

export function AuthzGenericGrantMsg(
  granter: string,
  grantee: string,
  typeURL: string,
  expiration: string
): Msg {
  const expWithNano = fromRfc3339WithNanoseconds(expiration);
  const expSec = Math.floor(expWithNano.getTime() / 1000);
  const expNano =
    (expWithNano.getTime() % 1000) * 1000000 + (expWithNano.nanoseconds ?? 0);
  const exp = Timestamp.fromPartial({
    nanos: expNano,
    seconds: BigInt(expSec),
  });

  return {
    typeUrl: msgAuthzGrantTypeUrl,
    value: {
      grant: {
        authorization: {
          typeUrl: '/cosmos.authz.v1beta1.GenericAuthorization',
          value: GenericAuthorization.encode(
            GenericAuthorization.fromPartial({
              msg: typeURL,
            })
          ).finish(),
        },
        expiration: exp,
      },
      grantee: grantee,
      granter: granter,
    },
  };
}

export function AuthzStakeGrantMsg({
  expiration,
  grantee,
  granter,
  allowList,
  denyList,
  maxTokens,
  denom,
  stakeAuthzType,
}: {
  granter: string;
  grantee: string;
  expiration: string;
  allowList?: string[];
  denyList?: string[];
  maxTokens?: string;
  denom?: string;
  stakeAuthzType: AuthorizationType;
}): Msg {
  const expWithNano = fromRfc3339WithNanoseconds(expiration);
  const expSec = Math.floor(expWithNano.getTime() / 1000);
  const expNano =
    (expWithNano.getTime() % 1000) * 1000000 + (expWithNano.nanoseconds ?? 0);
  const exp = Timestamp.fromPartial({
    nanos: expNano,
    seconds: BigInt(expSec),
  });

  const allow_list = StakeAuthorization_Validators.encode(
    StakeAuthorization_Validators.fromPartial({
      address: allowList,
    })
  ).finish();
  const deny_list = StakeAuthorization_Validators.encode(
    StakeAuthorization_Validators.fromPartial({
      address: denyList,
    })
  ).finish();
  const stakeAuthValue = StakeAuthorization.encode(
    StakeAuthorization.fromPartial({
      authorizationType: stakeAuthzType,
      allowList: allowList?.length
        ? StakeAuthorization_Validators.decode(allow_list)
        : undefined,
      denyList: denyList?.length
        ? StakeAuthorization_Validators.decode(deny_list)
        : undefined,
      maxTokens: maxTokens
        ? Coin.fromPartial({
            amount: maxTokens,
            denom: denom,
          })
        : undefined,
    })
  ).finish();
  const grantValue = MsgGrant.fromPartial({
    grant: {
      authorization: {
        typeUrl: '/cosmos.staking.v1beta1.StakeAuthorization',
        value: stakeAuthValue,
      },
      expiration: exp,
    },
    grantee: grantee,
    granter: granter,
  });

  return {
    typeUrl: msgAuthzGrantTypeUrl,
    value: grantValue,
  };
}
