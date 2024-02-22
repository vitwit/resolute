import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { formatTransaction } from '@/utils/transaction';
import Image from 'next/image';

const TransactionItem = ({
  transaction,
  msgFilters,
}: {
  transaction: ParsedTransaction;
  msgFilters: string[];
}) => {
  const chainID = transaction.chain_id;
  const { getDenomInfo } = useGetChainInfo();
  const { decimals, displayDenom } = getDenomInfo(chainID);
  const uiTx = formatTransaction(
    transaction,
    msgFilters,
    decimals,
    displayDenom
  );

  return uiTx.showTx ? (
    <div className="w-full flex gap-4">
      <div className="flex gap-2 min-w-[88px] max-w-[88px]">
        <div className="space-y-4">
          <div className="ml-auto text-right text-[12px] max-w-[68px] min-w-[68px]">
            {uiTx.time}
          </div>
          <div className="ml-auto bg-[#26233b] rounded-sm h-6 w-6 flex items-center justify-center">
            <Image src="/swap.svg" width={20} height={20} alt="transaction" />
          </div>
        </div>
        <Image
          width={12}
          height={112}
          alt="transaction"
          src="/vertical-divider.svg"
        />
      </div>
      <div className="space-y-2">
        <div className="flex h-6 items-center">
          <div className="text-sm font-normal leading-[14px] max-w-[293px] truncate">
            {uiTx.firstMessage}
          </div>
        </div>
        <div className="flex gap-2">
          <TransactionStatus uiTx={uiTx} />
        </div>
        <div className="flex gap-4">
          {uiTx.showMsgs[0] && <Chip msg={uiTx.showMsgs[0]} />}
          {uiTx.showMsgs[1] && <Chip msg={uiTx.showMsgs[1]} />}
          {uiTx.showMsgs[2] && <FilledChip count={uiTx.msgCount - 2} />}
        </div>
      </div>
    </div>
  ) : null;
};

export const Chip = ({ msg }: { msg: string }) => {
  return (
    <div className="chip bg-[#26233b] text-center text-[10px] not-italic font-normal leading-3">
      {msg}
    </div>
  );
};

export const FilledChip = ({ count }: { count: number }) => {
  return <div className="chip fill">+ {count} more</div>;
};

export const TransactionStatus = ({ uiTx }: { uiTx: UiTx }) => {
  const txStatus = uiTx.isTxSuccess
    ? 'Transaction Successful'
    : 'Transaction Failed';
  return uiTx.isIBCPending ? (
    <div className="flex items-center">
      <StatusContent content="Transaction Pending" />
      <div className="dots-flashing"></div>
    </div>
  ) : (
    <StatusContent content={txStatus} />
  );
};

export const StatusContent = ({ content }: { content: string }) => {
  return (
    <div className="text-xs not-italic font-normal leading-4 tracking-[0.48px] flex items-center">
      {content}
    </div>
  );
};

export default TransactionItem;
