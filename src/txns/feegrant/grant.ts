import { Timestamp } from "cosmjs-types/google/protobuf/timestamp";
import { Duration } from "cosmjs-types/google/protobuf/duration";
import Long from "long";
import { fromRfc3339WithNanoseconds } from "@cosmjs/tendermint-rpc";
import {
  BasicAllowance,
  PeriodicAllowance,
  AllowedMsgAllowance,
} from "cosmjs-types/cosmos/feegrant/v1beta1/feegrant";
import { Coin } from "cosmjs-types/cosmos/base/v1beta1/coin";
import { Msg } from "../types";
import { MsgGrantAllowance } from "cosmjs-types/cosmos/feegrant/v1beta1/tx";

const msgFeegrantGrantTypeUrl = "/cosmos.feegrant.v1beta1.MsgGrantAllowance";

export function FeegrantBasicMsg(
  granter: string,
  grantee: string,
  denom: string,
  spendLimit?: string,
  expiration?: string
): Msg {
  let exp: Timestamp | undefined;
  if (expiration) {
    const expWithNano = fromRfc3339WithNanoseconds(expiration);
    let expSec = Math.floor(expWithNano.getTime() / 1000);
    let expNano =
      (expWithNano.getTime() % 1000) * 1000000 + (expWithNano.nanoseconds ?? 0);
    exp = Timestamp.fromPartial({
      nanos: expNano,
      seconds: Long.fromNumber(expSec),
    });
  }

  const basicValue = BasicAllowance.encode(
    BasicAllowance.fromPartial({
      spendLimit:
        spendLimit === null
          ? undefined
          : [
              Coin.fromPartial({
                amount: String(spendLimit),
                denom: denom,
              }),
            ],
      expiration: exp,
    })
  ).finish();

  return {
    typeUrl: msgFeegrantGrantTypeUrl,
    value: MsgGrantAllowance.fromPartial({
      allowance: {
        typeUrl: "/cosmos.feegrant.v1beta1.BasicAllowance",
        value: basicValue,
      },
      grantee: grantee,
      granter: granter,
    }),
  };
}

export function FeegrantPeriodicMsg(
  granter: string,
  grantee: string,
  denom: string,
  spendLimit: number,
  period: number,
  periodSpendLimit: number,
  expiration?: string
) {
  try {
    const now = new Date();

    let exp: Timestamp | undefined;
    try {
      if (expiration) {
        const expWithNano = fromRfc3339WithNanoseconds(expiration);
        let expSec = Math.floor(expWithNano.getTime() / 1000);
        let expNano =
          (expWithNano.getTime() % 1000) * 1000000 +
          (expWithNano.nanoseconds ?? 0);
        exp = Timestamp.fromPartial({
          nanos: expNano,
          seconds: Long.fromNumber(expSec),
        });
      }
    } catch (error) {
      console.log("Error while expiration set", error);
    }

    const periodDuration = Duration.fromPartial({
      nanos: period,
      seconds: Long.fromNumber(period),
    });

    const basicValue = BasicAllowance.fromPartial({
      expiration: exp,
      spendLimit:
        spendLimit === undefined
          ? undefined
          : [
              Coin.fromPartial({
                amount: String(spendLimit),
                denom: denom,
              }),
            ],
    });

    const periodicValue = PeriodicAllowance.encode({
      basic: basicValue,
      period: periodDuration,
      periodReset: Timestamp.fromPartial({
        nanos: (now.getTime() % 1000) * 1000000 + periodDuration.nanos,
        seconds: Long.fromNumber(Math.floor(now.getTime() / 1000)).add(
          periodDuration.seconds
        ),
      }),
      periodCanSpend: [
        Coin.fromPartial({
          amount: String(periodSpendLimit),
          denom: denom,
        }),
      ],
      periodSpendLimit: [
        Coin.fromPartial({
          amount: String(periodSpendLimit),
          denom: denom,
        }),
      ],
    }).finish();

    return {
      typeUrl: msgFeegrantGrantTypeUrl,
      value: MsgGrantAllowance.fromPartial({
        allowance: {
          typeUrl: "/cosmos.feegrant.v1beta1.PeriodicAllowance",
          value: periodicValue,
        },
        grantee: grantee,
        granter: granter,
      }),
    };
  } catch (error) {
    console.log("error while creating periodic allowance", error);
    throw error;
  }
}

export function FeegrantFilterMsg(
  granter: string,
  grantee: string,
  denom: string,
  spendLimit: number,
  period: number,
  periodSpendLimit: number,
  expiration?: string,
  txMsg?: Array<string>,
  allowanceType?: string
) {
  try {
    const now = new Date();

    let exp: Timestamp | undefined;
    try {
      if (expiration) {
        const expWithNano = fromRfc3339WithNanoseconds(expiration);
        let expSec = Math.floor(expWithNano.getTime() / 1000);
        let expNano =
          (expWithNano.getTime() % 1000) * 1000000 +
          (expWithNano.nanoseconds ?? 0);
        exp = Timestamp.fromPartial({
          nanos: expNano,
          seconds: Long.fromNumber(expSec),
        });
      }
    } catch (error) {
      console.log("Error while expiration set", error);
    }

    const periodDuration = Duration.fromPartial({
      nanos: period,
      seconds: Long.fromNumber(period),
    });

    const basicValue = BasicAllowance.fromPartial({
      expiration: exp,
      spendLimit:
        spendLimit === undefined
          ? undefined
          : [
              Coin.fromPartial({
                amount: String(spendLimit),
                denom: denom,
              }),
            ],
    });

    const periodicValue = PeriodicAllowance.encode({
      basic: basicValue,
      period: periodDuration,
      periodReset: Timestamp.fromPartial({
        nanos: (now.getTime() % 1000) * 1000000 + periodDuration.nanos,
        seconds: Long.fromNumber(Math.floor(now.getTime() / 1000)).add(
          periodDuration.seconds
        ),
      }),
      periodCanSpend: [
        Coin.fromPartial({
          amount: String(periodSpendLimit),
          denom: denom,
        }),
      ],
      periodSpendLimit: [
        Coin.fromPartial({
          amount: String(periodSpendLimit),
          denom: denom,
        }),
      ],
    }).finish();

    let value, typeURL;
    let obj;

    if (allowanceType === "Basic") {
      value = basicValue;
      typeURL = "/cosmos.feegrant.v1beta1.BasicAllowance";

      obj = AllowedMsgAllowance.encode({
        allowance: {
          typeUrl: "/cosmos.feegrant.v1beta1.BasicAllowance",
          value: BasicAllowance.encode(basicValue).finish(),
        },
        allowedMessages: txMsg || [],
      }).finish();
    } else {
      value = periodicValue;
      typeURL = "/cosmos.feegrant.v1beta1.PeriodicAllowance";
      obj = AllowedMsgAllowance.encode({
        allowance: {
          typeUrl: typeURL,
          value: value,
        },
        allowedMessages: txMsg || [],
      }).finish();
    }

    return {
      typeUrl: msgFeegrantGrantTypeUrl,
      value: MsgGrantAllowance.fromPartial({
        allowance: {
          typeUrl: "/cosmos.feegrant.v1beta1.AllowedMsgAllowance",
          value: obj,
        },
        grantee: grantee,
        granter: granter,
      }),
    };
  } catch (error) {
    console.log("error while creating periodic allowance", error);
    throw error;
  }
}
