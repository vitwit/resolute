import {
  DELEGATE_TYPE_URL,
  DEPOSIT_TYPE_URL,
  IBC_SEND_TYPE_URL,
  MAP_TXN_TYPES,
  MSG_AUTHZ_EXEC,
  MSG_AUTHZ_GRANT,
  MSG_AUTHZ_REVOKE,
  MSG_GRANT_ALLOWANCE,
  MSG_REVOKE_ALLOWANCE,
  REDELEGATE_TYPE_URL,
  SEND_TYPE_URL,
  UNDELEGATE_TYPE_URL,
  VOTE_OPTIONS,
  VOTE_TYPE_URL,
} from '@/utils/constants';
import {
  getTypeURLName,
  parseAmount,
  shortenAddress,
  shortenString,
} from '@/utils/util';
import { get } from 'lodash';
import React from 'react';

const NewTxnMsg = ({
  msgs,
  currency,
  failed,
}: {
  msgs: NewMsg[];
  currency: Currency;
  failed: boolean;
}) => {
  const status = failed ? 'failed' : 'successfully';

  if (!msgs.length) {
    return null;
  }

  const msgType = msgs[0]?.typeUrl || get(msgs, '[0][@type]', '');
  const txTypeText = msgs?.length
    ? failed
      ? 'while ' + MAP_TXN_TYPES[msgType]?.[1] + ' to'
      : MAP_TXN_TYPES[msgType]?.[0] + ' to'
    : '';
  return (
    <>
      {msgs?.length ? (
        <div className="flex items-center gap-2">
          {msgType === SEND_TYPE_URL ? (
            <div className="flex items-center gap-2 font-bold">
              <div>
                <span>{parseAmount(msgs[0]?.amount, currency)}</span>{' '}
                <span>{status}</span> <span>{txTypeText}</span>
              </div>
              <span>
                <div className="inline font-normal">
                  <span className="truncate">
                    {shortenAddress(msgs[0]?.to_address || '', 15) || '-'}
                  </span>
                </div>
              </span>
              <MoreMessages msgs={msgs} />
            </div>
          ) : null}
          {msgType === DELEGATE_TYPE_URL ? (
            <div className="flex items-center gap-2 font-bold">
              <div className="truncate max-w-[360px]">
                <span>{parseAmount([msgs[0]?.amount], currency)}</span>{' '}
                <span>{status}</span> <span>{txTypeText}</span>
              </div>
              <span>
                <div className="inline font-normal">
                  <span className="truncate">
                    {shortenString(msgs[0]?.validator_address, 24) || '-'}
                  </span>
                </div>
              </span>
              <MoreMessages msgs={msgs} />
            </div>
          ) : null}
          {msgType === UNDELEGATE_TYPE_URL ? (
            <div className="flex items-center gap-2 font-bold">
              <div>
                <span>{parseAmount([msgs[0]?.amount], currency)}</span>{' '}
                <span>{status}</span>{' '}
                <span>
                  {failed
                    ? 'while ' + MAP_TXN_TYPES[msgType][1] + ' from'
                    : MAP_TXN_TYPES[msgType][0] + 'from'}
                </span>
              </div>
              <span>
                <div className="inline font-normal">
                  <span className="truncate">
                    {shortenString(msgs[0]?.validator_address || '', 24) || '-'}
                  </span>
                </div>
              </span>
              <MoreMessages msgs={msgs} />
            </div>
          ) : null}
          {msgType === REDELEGATE_TYPE_URL ? (
            <div className="flex items-center gap-2 font-bold">
              <div className="truncate">
                <span>{parseAmount([msgs[0]?.amount], currency)}</span>{' '}
                <span>{status}</span>{' '}
                <span>
                  {failed
                    ? 'while ' + MAP_TXN_TYPES[msgType][1]
                    : MAP_TXN_TYPES[msgType][0]}
                </span>
              </div>
              <MoreMessages msgs={msgs} />
            </div>
          ) : null}
          {msgType === VOTE_TYPE_URL ? (
            <div className="flex items-center gap-2 font-bold">
              <div className="truncate">
                <span className="capitalize">{status}</span>{' '}
                <span>
                  {failed
                    ? 'while ' + MAP_TXN_TYPES[msgType][1]
                    : MAP_TXN_TYPES[msgType][0]}
                </span>
                <span> {VOTE_OPTIONS[get(msgs, '[0].option', 0) - 1]}</span>
                <span> on </span>
                <span>
                  proposal #{parseInt(get(msgs, '[0].proposal_id', ''))}
                </span>
              </div>
              <MoreMessages msgs={msgs} />
            </div>
          ) : null}
          {msgType === DEPOSIT_TYPE_URL ? (
            <div className="flex items-center gap-2 font-bold">
              <div className="truncate">
                <span>{parseAmount(msgs[0]?.amount, currency)}</span>{' '}
                <span>{status}</span>{' '}
                <span>
                  {failed
                    ? 'while ' + MAP_TXN_TYPES[msgType][1]
                    : MAP_TXN_TYPES[msgType][0]}
                </span>
                <span> on proposal #{parseInt(msgs[0]?.proposal_id)}</span>
              </div>
              <MoreMessages msgs={msgs} />
            </div>
          ) : null}
          {msgType === IBC_SEND_TYPE_URL ? (
            <div className="flex items-center gap-2 font-bold">
              <div>
                <span>{parseAmount([msgs[0]?.token], currency)}</span>{' '}
                <span className='capitalize'>{status}</span> <span>{txTypeText}</span>
              </div>
              <span>
                <div className="inline font-normal">
                  <span>
                    {shortenAddress(msgs[0]?.receiver || '', 15) || '-'}
                  </span>
                </div>
              </span>
              <MoreMessages msgs={msgs} />
            </div>
          ) : null}
          {msgType === MSG_AUTHZ_GRANT ? (
            <div className="flex items-center gap-2 font-bold">
              <div>
                <span className='capitalize'>{status}</span> granted to{' '}
              </div>
              <span>
                <div className="inline font-normal">
                  <span>
                    {shortenAddress(get(msgs, '[0].grantee', '') || '', 15) ||
                      '-'}
                  </span>
                </div>
              </span>
              <MoreMessages msgs={msgs} />
            </div>
          ) : null}
          {msgType === MSG_AUTHZ_REVOKE ? (
            <div className="flex items-center gap-2 font-bold">
              <div>
                <span className="capitalize">{status}</span>{' '}
              </div>
              <span>
                <div className="inline font-normal">
                  <span>
                    {' '}
                    {'revoked authz from '}
                    {shortenAddress(get(msgs, '[0].grantee', '') || '', 15) ||
                      '-'}
                  </span>
                </div>
              </span>
              <MoreMessages msgs={msgs} />
            </div>
          ) : null}
          {msgType === MSG_AUTHZ_EXEC ? (
            <div className="flex items-center gap-1">
              <div>
                <span className="capitalize">{status}</span> Executed{' '}
              </div>
              <span>
                <div className="font-bold">
                  <span>
                    {get(msgs, '[0].msgs', []).map((m, mindex) => (
                      <div key={mindex}>
                        Authz&nbsp;{getTypeURLName(get(m, '@type'))}
                      </div>
                    ))}
                  </span>
                </div>
              </span>
              <MoreMessages msgs={msgs} />
            </div>
          ) : null}
          {msgType === MSG_GRANT_ALLOWANCE ? (
            <div className="flex items-center gap-2 font-bold">
              <div>
                <span className="capitalize">{status}</span> granted allowance
                to{' '}
              </div>
              <span>
                <div className="inline font-normal">
                  <span>
                    {shortenAddress(get(msgs, '[0].grantee', '') || '', 15) ||
                      '-'}
                  </span>
                </div>
              </span>
              <MoreMessages msgs={msgs} />
            </div>
          ) : null}
          {msgType === MSG_REVOKE_ALLOWANCE ? (
            <div className="flex items-center gap-2 font-bold">
              <div>
                <span className="capitalize">{status}</span> revoked allowance
                from{' '}
              </div>
              <span>
                <div className="inline font-normal">
                  <span>
                    {shortenAddress(get(msgs, '[0].grantee', '') || '', 15) ||
                      '-'}
                  </span>
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

export default NewTxnMsg;

const MoreMessages = ({ msgs }: { msgs: NewMsg[] }) => {
  return (
    <>
      {msgs.length > 1 ? (
        <span className="more-msgs">+{msgs.length - 1}</span>
      ) : null}
    </>
  );
};
