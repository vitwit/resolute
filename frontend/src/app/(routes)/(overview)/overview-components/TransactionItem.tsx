import { formatTransaction } from '@/utils/transaction';
import Image from 'next/image';

const TransactionItem = ({
  transaction,
  msgFilters,
}: {
  transaction: Transaction;
  msgFilters: string[];
}) => {
  const uiTx = formatTransaction(transaction, msgFilters);

  return uiTx.showTx ? (
    <div className="w-full flex gap-4">
      <div className="flex gap-2 min-w-[88px] max-w-[88px]">
        <div className="space-y-4">
          <div className="ml-auto text-right text-[12px] max-w-[68px] min-w-[68px]">
            {uiTx.time}
          </div>
          <Image
            className="ml-auto bg-[#26233b] rounded-sm"
            src="/swap.svg"
            width={24}
            height={24}
            alt="transaction"
          />
        </div>
        <Image
          width={12}
          height={112}
          alt="transaction"
          src="/vertical-divider.svg"
        />
      </div>
      <div className="space-y-2">
        <div className='flex h-6 items-center'>
          <div className="text-sm font-normal leading-[14px] max-w-[293px] truncate">
            {uiTx.firstMessage}
          </div>
        </div>
        <div className="flex gap-2">
          <Image
            width={20}
            height={20}
            alt="success"
            src="/round-checked.svg"
          />
          <div className="text-xs not-italic font-normal leading-4 tracking-[0.48px] flex items-center">
            {uiTx.isTxSuccess ? 'Transaction Successful' : 'Transaction Failed'}
          </div>
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
    <div className="chip bg-[#26233b] text-center text-xs not-italic font-normal leading-3">
      {msg}
    </div>
  );
};

export const FilledChip = ({ count }: { count: number }) => {
  return <div className="chip fill">+ {count} more</div>;
};

export default TransactionItem;
