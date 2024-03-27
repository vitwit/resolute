import {
  DELEGATE_TYPE_URL,
  DEPOSIT_TYPE_URL,
  IBC_SEND_TYPE_URL,
  MAP_TXN_TYPES,
  REDELEGATE_TYPE_URL,
  SEND_TYPE_URL,
  UNDELEGATE_TYPE_URL,
  VOTE_OPTIONS,
  VOTE_TYPE_URL,
} from '@/utils/constants';
import { capitalizeFirstLetter, parseAmount } from '@/utils/util';
import React from 'react';
import Image from 'next/image';
import { copyToClipboard } from '@/utils/copyToClipboard';
import { useAppDispatch } from '@/custom-hooks/StateHooks';
import { setError } from '@/store/features/common/commonSlice';

const TxnMessage = ({
  msgs,
  currency,
  failed,
}: {
  msgs: Msg[];
  currency: Currency;
  failed: boolean;
}) => {
  const dispatch = useAppDispatch();
  const status = failed ? 'failed' : 'successfully';

  const msgType = msgs[0]?.typeUrl;
  const txTypeText = msgs?.length
    ? failed
      ? 'while ' + MAP_TXN_TYPES[msgType]?.[1] + ' to'
      : MAP_TXN_TYPES[msgType]?.[0] + ' to'
    : '';
  return (
    <>
      {msgs?.length ? (
        <div className="flex items-center gap-2">
          {msgs[0]?.typeUrl === SEND_TYPE_URL ? (
            <div className="flex items-center gap-2 font-bold">
              <div className="truncate max-w-[260px]">
                <span>{parseAmount(msgs[0]?.value?.amount, currency)}</span>{' '}
                <span>{status}</span> <span>{txTypeText}</span>
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
              <MoreMessages msgs={msgs} />
            </div>
          ) : null}
          {msgs[0]?.typeUrl === DELEGATE_TYPE_URL ? (
            <div className="flex items-center gap-2 font-bold">
              <div className="truncate max-w-[260px]">
                <span>{parseAmount([msgs[0]?.value?.amount], currency)}</span>{' '}
                <span>{status}</span> <span>{txTypeText}</span>
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
              <MoreMessages msgs={msgs} />
            </div>
          ) : null}
          {msgs[0]?.typeUrl === UNDELEGATE_TYPE_URL ? (
            <div className="flex items-center gap-2 font-bold">
              <div className="truncate max-w-[260px]">
                <span>{parseAmount([msgs[0]?.value?.amount], currency)}</span>{' '}
                <span>{status}</span>{' '}
                <span>
                  {failed
                    ? 'while ' + MAP_TXN_TYPES[msgs[0]?.typeUrl][1] + ' from'
                    : MAP_TXN_TYPES[msgs[0]?.typeUrl][0] + 'from'}
                </span>
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
              <MoreMessages msgs={msgs} />
            </div>
          ) : null}
          {msgs[0]?.typeUrl === REDELEGATE_TYPE_URL ? (
            <div className="flex items-center gap-2 font-bold">
              <div className="truncate">
                <span>{parseAmount([msgs[0]?.value?.amount], currency)}</span>{' '}
                <span>{status}</span>{' '}
                <span>
                  {failed
                    ? 'while ' + MAP_TXN_TYPES[msgs[0]?.typeUrl][1]
                    : MAP_TXN_TYPES[msgs[0]?.typeUrl][0]}
                </span>
              </div>
              <MoreMessages msgs={msgs} />
            </div>
          ) : null}
          {msgs[0]?.typeUrl === VOTE_TYPE_URL ? (
            <div className="flex items-center gap-2 font-bold">
              <div className="truncate">
                <span>{capitalizeFirstLetter(status)}</span>{' '}
                <span>
                  {failed
                    ? 'while ' + MAP_TXN_TYPES[msgs[0]?.typeUrl][1]
                    : MAP_TXN_TYPES[msgs[0]?.typeUrl][0]}
                </span>
                <span> {VOTE_OPTIONS[msgs[0]?.value?.option - 1]}</span>
                <span> on </span>
                <span>proposal #{parseInt(msgs[0]?.value.proposalId)}</span>
              </div>
              <MoreMessages msgs={msgs} />
            </div>
          ) : null}
          {msgs[0]?.typeUrl === DEPOSIT_TYPE_URL ? (
            <div className="flex items-center gap-2 font-bold">
              <div className="truncate">
                <span>{parseAmount(msgs[0]?.value?.amount, currency)}</span>{' '}
                <span>{status}</span>{' '}
                <span>
                  {failed
                    ? 'while ' + MAP_TXN_TYPES[msgs[0]?.typeUrl][1]
                    : MAP_TXN_TYPES[msgs[0]?.typeUrl][0]}
                </span>
                <span> on proposal #{parseInt(msgs[0]?.value.proposalId)}</span>
              </div>
              <MoreMessages msgs={msgs} />
            </div>
          ) : null}
          {msgs[0]?.typeUrl === IBC_SEND_TYPE_URL ? (
            <div className="flex items-center gap-2 font-bold">
              <div className="truncate max-w-[260px]">
                <span>{parseAmount([msgs[0]?.value?.token], currency)}</span>{' '}
                <span>{status}</span> <span>{txTypeText}</span>
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
              <MoreMessages msgs={msgs} />
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );
};

export default TxnMessage;

const MoreMessages = ({ msgs }: { msgs: Msg[] }) => {
  return (
    <>
      {msgs.length > 1 ? (
        <span className="more-msgs">+{msgs.length - 1}</span>
      ) : null}
    </>
  );
};
