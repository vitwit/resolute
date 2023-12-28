import {
  DELEGATE_TYPE_URL,
  IBC_SEND_TYPE_URL,
  REDELEGATE_TYPE_URL,
  SEND_TYPE_URL,
  UNDELEGATE_TYPE_URL,
  VOTE_TYPE_URL,
} from '@/utils/constants';
import { parseAmount } from '@/utils/util';
import React from 'react';
import Image from 'next/image';
import { copyToClipboard } from '@/utils/copyToClipboard';
import { useAppDispatch } from '@/custom-hooks/StateHooks';
import { setError } from '@/store/features/common/commonSlice';

const MAP_TXNS = {
  '/cosmos.staking.v1beta1.MsgDelegate': 'delegated',
  '/cosmos.bank.v1beta1.MsgSend': 'sent',
  '/cosmos.staking.v1beta1.MsgBeginRedelegate': 'redelegated',
  '/cosmos.staking.v1beta1.MsgUndelegate': 'undelegated',
  '/cosmos.gov.v1beta1.MsgVote': 'voted',
  '/ibc.applications.transfer.v1.MsgTransfer': 'sent',
  Msg: 'Tx Msg',
};

const VOTE_OPTIONS = ['Yes', 'Abstain', 'No', 'Veto'];

const TxnMessage = ({
  msgs,
  currency,
}: {
  msgs: Msg[];
  currency: Currency;
}) => {
  const dispatch = useAppDispatch();
  return (
    <>
      {msgs?.length ? (
        <div className="flex items-center gap-2">
          {msgs[0]?.typeUrl === SEND_TYPE_URL ? (
            <div className="flex items-center gap-2 font-bold">
              <div className="truncate max-w-[260px]">
                <span>{parseAmount(msgs[0]?.value?.amount, currency)}</span>{' '}
                <span>successfully</span>{' '}
                <span>{MAP_TXNS[msgs[0]?.typeUrl]}</span>
                &nbsp;to
              </div>
              <span>
                <div className="common-copy max-w-[176px] inline font-normal">
                  <span className="truncate">
                    {msgs[0]?.value?.toAddress || '-'}
                  </span>
                  <Image
                    className="cursor-pointer"
                    onClick={(e) => {
                      copyToClipboard(msgs[0]?.value?.toAddress || '-');
                      dispatch(
                        setError({
                          type: 'success',
                          message: 'Copied',
                        })
                      );
                      e.stopPropagation();
                    }}
                    src="/copy-icon-plain.svg"
                    width={24}
                    height={24}
                    alt="copy"
                  />
                </div>
              </span>
            </div>
          ) : null}
          {msgs[0]?.typeUrl === DELEGATE_TYPE_URL ? (
            <div className="flex items-center gap-2 font-bold">
              <div className="truncate max-w-[260px]">
                <span>{parseAmount([msgs[0]?.value?.amount], currency)}</span>{' '}
                <span>successfully</span>{' '}
                <span>{MAP_TXNS[msgs[0]?.typeUrl]}</span>
                &nbsp;to
              </div>
              <span>
                <div className="common-copy max-w-[176px] inline font-normal">
                  <span className="truncate">
                    {msgs[0]?.value?.validatorAddress || '-'}
                  </span>
                  <Image
                    className="cursor-pointer"
                    onClick={(e) => {
                      copyToClipboard(msgs[0]?.value?.validatorAddress || '-');
                      dispatch(
                        setError({
                          type: 'success',
                          message: 'Copied',
                        })
                      );
                      e.stopPropagation();
                    }}
                    src="/copy-icon-plain.svg"
                    width={24}
                    height={24}
                    alt="copy"
                  />
                </div>
              </span>
            </div>
          ) : null}
          {msgs[0]?.typeUrl === UNDELEGATE_TYPE_URL ? (
            <div className="flex items-center gap-2 font-bold">
              <div className="truncate max-w-[260px]">
                <span>{parseAmount([msgs[0]?.value?.amount], currency)}</span>{' '}
                <span>successfully</span>{' '}
                <span>{MAP_TXNS[msgs[0]?.typeUrl]}</span>
                &nbsp;from
              </div>
              <span>
                <div className="common-copy max-w-[176px] inline font-normal">
                  <span className="truncate">
                    {msgs[0]?.value?.validatorAddress || '-'}
                  </span>
                  <Image
                    className="cursor-pointer"
                    onClick={(e) => {
                      copyToClipboard(msgs[0]?.value?.validatorAddress || '-');
                      dispatch(
                        setError({
                          type: 'success',
                          message: 'Copied',
                        })
                      );
                      e.stopPropagation();
                    }}
                    src="/copy-icon-plain.svg"
                    width={24}
                    height={24}
                    alt="copy"
                  />
                </div>
              </span>
            </div>
          ) : null}
          {msgs[0]?.typeUrl === REDELEGATE_TYPE_URL ? (
            <div className="flex items-center gap-2 font-bold">
              <div className="truncate">
                <span>{parseAmount([msgs[0]?.value?.amount], currency)}</span>{' '}
                <span>successfully</span>{' '}
                <span>{MAP_TXNS[msgs[0]?.typeUrl]}</span>
              </div>
            </div>
          ) : null}
          {msgs[0]?.typeUrl === VOTE_TYPE_URL ? (
            <div className="flex items-center gap-2 font-bold">
              <div className="truncate">
                <span>Successfully</span>{' '}
                <span>{MAP_TXNS[msgs[0]?.typeUrl]}</span>
                <span> {VOTE_OPTIONS[msgs[0]?.value?.option - 1]}</span>
                <span> on </span>
                <span>proposal #{parseInt(msgs[0]?.value.proposalId)}</span>
              </div>
            </div>
          ) : null}
          {msgs[0]?.typeUrl === IBC_SEND_TYPE_URL ? (
            <div className="flex items-center gap-2 font-bold">
              <div className="truncate max-w-[260px]">
                <span>{parseAmount([msgs[0]?.value?.token], currency)}</span>{' '}
                <span>successfully</span>{' '}
                <span>{MAP_TXNS[msgs[0]?.typeUrl]}</span>
                &nbsp;to
              </div>
              <span>
                <div className="common-copy max-w-[176px] inline font-normal">
                  <span className="truncate">
                    {msgs[0]?.value?.receiver || '-'}
                  </span>
                  <Image
                    className="cursor-pointer"
                    onClick={(e) => {
                      copyToClipboard(msgs[0]?.value?.receiver || '-');
                      dispatch(
                        setError({
                          type: 'success',
                          message: 'Copied',
                        })
                      );
                      e.stopPropagation();
                    }}
                    src="/copy-icon-plain.svg"
                    width={24}
                    height={24}
                    alt="copy"
                  />
                </div>
              </span>
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );
};

export default TxnMessage;
