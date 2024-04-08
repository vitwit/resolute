import { msgAuthzExecTypeUrl } from '@/txns/authz/exec';
import { msgAuthzGrantTypeUrl } from '@/txns/authz/grant';
import { msgSendTypeUrl } from '@/txns/bank/send';
import { msgWithdrawRewards } from '@/txns/distribution/withDrawRewards';
import { msgFeegrantGrantTypeUrl } from '@/txns/feegrant/grant';
import { msgDepositTypeUrl } from '@/txns/gov/deposit';
import { msgVoteTypeUrl } from '@/txns/gov/vote';
import { msgTransfer } from '@/txns/ibc/transfer';
import { msgDelegate } from '@/txns/staking/delegate';
import { msgReDelegate } from '@/txns/staking/redelegate';
import { msgUnDelegate } from '@/txns/staking/undelegate';
import TextCopyField from './TextCopyField';
import { parseBalance } from '@/utils/denom';
import { formatNumber, parseDenomAmount } from '@/utils/util';
import { voteOptions } from '@/utils/constants';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Message = any;

const RenderFormattedMessage = ({
  message,
  coinDenom,
  decimals,
}: {
  message: Message;
  decimals: number;
  coinDenom: string;
}) => {
  const msgType = message?.['@type'];
  switch (msgType) {
    case msgDelegate:
      return (
        <DelegateMsg
          coinDenom={coinDenom}
          decimals={decimals}
          msg={message}
          isDelegate={true}
        />
      );
    case msgUnDelegate:
      return (
        <DelegateMsg
          coinDenom={coinDenom}
          decimals={decimals}
          msg={message}
          isDelegate={false}
        />
      );
    case msgReDelegate:
      return (
        <RedelegateMsg
          coinDenom={coinDenom}
          decimals={decimals}
          msg={message}
        />
      );
    case msgSendTypeUrl:
      return (
        <SendMsg coinDenom={coinDenom} decimals={decimals} msg={message} />
      );
    case msgWithdrawRewards:
      return <ClaimRewards msg={message} />;
    case msgTransfer:
      return 'IBC Send';
    case msgAuthzExecTypeUrl:
      return 'Exec Authz';
    case msgAuthzGrantTypeUrl:
      return <GrantMsg msg={message} isAuthz={true} />;
    case msgFeegrantGrantTypeUrl:
      return <GrantMsg msg={message} isAuthz={false} />;
    case msgVoteTypeUrl:
      return <VoteMsg msg={message} />;
    case msgDepositTypeUrl:
      return 'Deposit';
    default:
      return msgType.split('.').slice(-1)?.[0] || msgType;
  }
};

export default RenderFormattedMessage;

const SendMsg = ({
  decimals,
  msg,
  coinDenom,
}: {
  msg: Message;
  decimals: number;
  coinDenom: string;
}) => {
  const { to_address, amount } = msg;
  const parsedAmount = parseBalance(amount, decimals, amount[0].denom);

  return (
    <div className="text-[16px] flex gap-2 items-center">
      <div>Sent</div>
      <div className="message-text-gradient font-bold">
        {formatNumber(parsedAmount)} {coinDenom}
      </div>
      <div className="text-[#ffffff80]">to</div>
      <TextCopyField displayLen={20} isAddress={true} content={to_address} />
    </div>
  );
};

const DelegateMsg = ({
  decimals,
  msg,
  coinDenom,
  isDelegate,
}: {
  msg: Message;
  decimals: number;
  coinDenom: string;
  isDelegate: boolean;
}) => {
  const { amount, validator_address } = msg;
  const parsedAmount = formatNumber(
    parseDenomAmount(amount?.amount || '0', decimals)
  );
  return (
    <div className="text-[16px] flex gap-2 items-center">
      <div>{isDelegate ? 'Delegated' : 'UnDelegated'}</div>
      <div className="message-text-gradient font-bold">
        {parsedAmount} {coinDenom}
      </div>
      <div className="text-[#ffffff80]">{isDelegate ? 'to' : 'from'}</div>
      <TextCopyField
        displayLen={20}
        isAddress={true}
        content={validator_address}
      />
    </div>
  );
};

const RedelegateMsg = ({
  decimals,
  msg,
  coinDenom,
}: {
  msg: Message;
  decimals: number;
  coinDenom: string;
}) => {
  const { amount } = msg;
  const parsedAmount = formatNumber(
    parseDenomAmount(amount?.amount || '0', decimals)
  );
  return (
    <div className="text-[16px] flex gap-2 items-center">
      <div>Redelegated</div>
      <div className="message-text-gradient font-bold">
        {parsedAmount} {coinDenom}
      </div>
    </div>
  );
};

const ClaimRewards = ({ msg }: { msg: Message }) => {
  const { validator_address } = msg;
  return (
    <div className="text-[16px] flex gap-2 items-center">
      <div>Claimed Rewards</div>
      <div className="text-[#ffffff80]">from</div>
      <TextCopyField
        displayLen={20}
        isAddress={true}
        content={validator_address}
      />
    </div>
  );
};

const GrantMsg = ({ msg, isAuthz }: { msg: Message; isAuthz: boolean }) => {
  const { grantee } = msg;
  return (
    <div className="text-[16px] flex gap-2 items-center">
      <div>{isAuthz ? 'Granted authz' : 'Granted allowance'}</div>
      <div className="text-[#ffffff80]">to</div>
      <TextCopyField displayLen={20} isAddress={true} content={grantee} />
    </div>
  );
};

const VoteMsg = ({ msg }: { msg: Message }) => {
  const { option, proposal_id } = msg;
  return (
    <div className="text-[16px] flex gap-2 items-center">
      <div>Voted</div>
      <div className="message-text-gradient font-bold uppercase">
        {voteOptions?.[option] || 'Unknown'}
      </div>
      <div className="text-[#ffffff80]">on</div>
      <div>
        proposal <span className="font-bold">#{proposal_id}</span>{' '}
      </div>
    </div>
  );
};
