import React from 'react';
import { format } from 'date-fns';
import { TxStatus } from '@/types/enums';
import CustomLoader from '@/components/common/CustomLoader';
import { Action } from '@/store/features/valoren/valorenService';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';

export enum ActionType {
  RESTAKE = 'restake',
  REDELEGATE = 'redelegate',
}

interface RestakePayload {
  value: {
    amount: {
      denom: string;
      amount: string;
    };
    delegatorAddress: string;
    validatorAddress: string;
  };
  typeUrl: string;
}

interface RedelegatePayload {
  value: {
    sourceValidatorAddress: string;
    destinationValidatorAddress: string;
  };
  typeUrl: string;
}

interface ActionTableProps {
  actions: Action[];
  actionsLoading: TxStatus;
  chainID: string;
}

const ActionTable: React.FC<ActionTableProps> = ({
  actions,
  actionsLoading,
  chainID,
}) => {
  const { getDenomInfo } = useGetChainInfo();
  const { decimals, displayDenom } = getDenomInfo(chainID);
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
  };

  const formatInterval = (interval: number) => {
    const days = Math.floor(interval / 86400);
    return `${days} days`;
  };

  const formatAmount = (amount: string) => {
    const amountInUnits = parseInt(amount) / 10 ** decimals;
    return `${amountInUnits} ${displayDenom}`;
  };

  const formatValidatorAddress = (address: string) => {
    return `${address.slice(0, 12)}...${address.slice(-8)}`;
  };

  if (actionsLoading === TxStatus.PENDING) {
    return (
      <div className="flex justify-center items-center py-8">
        <CustomLoader loadingText="Fetching actions" textStyles="italic" />
      </div>
    );
  }

  if (actionsLoading === TxStatus.REJECTED) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-red-400">- Failed to fetch actions -</div>
      </div>
    );
  }

  if (!actions?.length) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-[16px]">- No Actions Found -</div>
      </div>
    );
  }

  return (
    <div className="px-6 overflow-x-auto overflow-y-scroll">
      <table className="min-w-full divide-y divide-[#424242a0]">
        <thead>
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
              Action Type
            </th>

            <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
              Details
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
              Interval
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
              Last Executed
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
              Next Execution
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#373737a0]">
          {actions.map((action) => (
            <tr
              key={action.id}
              className="hover:bg-[#ffffff0D] transition-colors"
            >
              <td className="px-4 py-3 text-sm whitespace-nowrap">
                <span className="capitalize">{action.type}</span>
              </td>
              <td className="px-4 py-3 text-sm">
                {action.type === ActionType.RESTAKE && (
                  <div className="flex flex-col gap-3 p-4 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className=" font-semibold">Min Reward Amount:</span>
                      <span className="">
                        {formatAmount(
                          (action.payload as RestakePayload).value.amount.amount
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className=" font-semibold">Validator:</span>
                      <span className="">
                        {formatValidatorAddress(
                          (action.payload as RestakePayload).value
                            .validatorAddress
                        )}
                      </span>
                    </div>
                  </div>
                )}
                {action.type === ActionType.REDELEGATE && (
                  <div className="flex flex-col gap-3 p-4 rounded-lg shadow-sm">
                    <div className="flex items-center gap-2">
                      <span className=" font-semibold">From:</span>
                      <span className="">
                        {formatValidatorAddress(
                          (action.payload as RedelegatePayload).value
                            .sourceValidatorAddress
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className=" font-semibold">To:</span>
                      <span className="">
                        {formatValidatorAddress(
                          (action.payload as RedelegatePayload).value
                            .destinationValidatorAddress
                        )}
                      </span>
                    </div>
                  </div>
                )}
              </td>

              <td className="px-4 py-3 text-sm whitespace-nowrap">
                {formatInterval(Number(action.interval))}
              </td>
              <td className="px-4 py-3 text-sm whitespace-nowrap">
                {formatDate(action.last_executed)}
              </td>
              <td className="px-4 py-3 text-sm whitespace-nowrap">
                {formatDate(action.next_execution)}
              </td>
              <td className="px-4 py-3 text-sm whitespace-nowrap">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                    action.status === 'active'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {action.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ActionTable;
