import { getTypeURLName } from '@/utils/util';
import { get } from 'lodash';
import Image from 'next/image';
import React from 'react';
import {
    DELEGATE_TYPE_URL,
    REDELEGATE_TYPE_URL,
    UNDELEGATE_TYPE_URL,
    MSG_AUTHZ_EXEC,
    VOTE_TYPE_URL,
    MSG_AUTHZ_GRANT,
} from '@/utils/constants';
import { shortenAddress } from '@/utils/util';
import NumberFormat from '@/components/common/NumberFormat';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { getLocalTime } from '@/utils/dataTime';

interface TxMsgProps {
    msg: NewMsg;
    expandedIndex: number | null;
    toggleExpand: (value: number) => void;
    mIndex: number;
    chainID: string;
}

const voteOptions: Record<string, string> = {
    'VOTE_OPTION_YES': 'Yes',
    'VOTE_OPTION_NO': 'Abstain',
    'VOTE_OPTION_ABSTAIN': 'No',
    'VOTE_OPTION_NO_WITH_VETO': 'No With Veto',
};

const TxMsg: React.FC<TxMsgProps> = ({ msg, expandedIndex, chainID, toggleExpand, mIndex }) => {
    const msgType = get(msg, '@type', '');

    const { getDenomInfo } = useGetChainInfo();

    const getAmount = (amount: number) => {
        const { decimals, displayDenom } = getDenomInfo(chainID);
        return {
            amount: (amount / 10 ** decimals).toFixed(6),
            denom: displayDenom,
        };
    };

    const renderMessageDetails = () => {
        switch (msgType) {
            case UNDELEGATE_TYPE_URL:
                return (
                    <div className="flex justify-between px-6 w-full pb-4">
                        <div className="flex flex-col gap-2">
                            <p className="text-b1-light">Validator</p>
                            <span className="text-b1">{shortenAddress(get(msg, 'validator_address', ''), 24)}</span>
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="text-b1-light">Amount</p>
                            <NumberFormat
                                cls=""
                                type="token"
                                value={getAmount(Number(get(msg, 'amount.amount', ''))).amount}
                                token={getAmount(Number(get(msg, 'amount.amount', ''))).denom}
                            />
                        </div>
                    </div>
                );
            case REDELEGATE_TYPE_URL:
                return (
                    <div className="flex justify-between px-6 w-full pb-4">
                        <div className="flex flex-col gap-2">
                            <p className="text-b1-light">Source Validator</p>
                            <span className="text-b1">
                                {shortenAddress(get(msg, 'validator_src_address', ''), 24)}
                            </span>
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="text-b1-light">Destination Validator</p>
                            <span className="text-b1">
                                {shortenAddress(get(msg, 'validator_dst_address', ''), 24)}
                            </span>
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="text-b1-light">Amount</p>
                            <NumberFormat
                                cls=""
                                type="token"
                                value={getAmount(Number(get(msg, 'amount.amount', ''))).amount}
                                token={getAmount(Number(get(msg, 'amount.amount', ''))).denom}
                            />
                        </div>
                    </div>
                );
            case DELEGATE_TYPE_URL:
                return (
                    <div className="flex justify-between px-6 w-full pb-4">
                        <div className="flex flex-col gap-2">
                            <p className="text-b1-light">Validator</p>
                            <span className="text-b1">
                                {shortenAddress(get(msg, 'validator_address', ''), 24)}
                            </span>
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="text-b1-light">Amount</p>
                            <NumberFormat
                                cls=""
                                type="token"
                                value={getAmount(Number(get(msg, 'amount.amount', ''))).amount}
                                token={getAmount(Number(get(msg, 'amount.amount', ''))).denom}
                            />
                        </div>
                    </div>
                );
            case VOTE_TYPE_URL:
                return (
                    <div className="flex justify-between px-6 w-full pb-4">
                        <div className="flex flex-col gap-2">
                            <p className="text-b1-light">Voter</p>
                            <span className="text-b1">
                                {shortenAddress(get(msg, 'voter', ''), 24)}
                            </span>
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="text-b1-light">Proposal ID</p>
                            <span className="text-b1">
                                {get(msg, 'proposal_id', '')}
                            </span>
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="text-b1-light">Option</p>
                            {voteOptions[get(msg, 'option')]}
                        </div>
                    </div>
                );
            case MSG_AUTHZ_GRANT:
                return (<>
                    <div className="flex justify-between px-6 w-full pb-4">
                        <div className="flex flex-col gap-2">
                            <p className="text-b1-light">Granter</p>
                            <span className="text-b1">
                                {shortenAddress(get(msg, 'granter', ''), 24)}
                            </span>
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="text-b1-light">Grantee</p>
                            <span className="text-b1">
                                {shortenAddress(get(msg, 'grantee', ''), 24)}
                            </span>
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="text-b1-light">Type</p>
                            {get(msg, 'grant.authorization.authorization_type', '-')}
                        </div>
                    </div>
                    <div className="flex justify-between px-6 w-full pb-4">
                        <div className="flex flex-col gap-2">
                            <p className="text-b1-light">Deny List</p>
                            {
                                get(msg, 'grant.authorization.deny_list.address', []).map((a: string, i: number) => (
                                    <p key={i}>{shortenAddress(a, 24)}</p>
                                ))
                            }
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="text-b1-light">Expiry</p>
                            {getLocalTime(get(msg, 'grant.expiration', '-'))}
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="text-b1-light">Max Tokens</p>
                            <NumberFormat
                                cls=''
                                type='token'
                                value={getAmount(Number(get(msg, 'grant.authorization.max_tokens.amount'))).amount}
                                token={getAmount(Number(get(msg, 'grant.authorization.max_tokens.amount'))).denom}
                            />
                        </div>
                    </div>
                </>
                );
            default:
                return <div>
                    <pre>
                        {JSON.stringify(msg, null, 2)}
                    </pre>
                </div>;
        }
    };

    return (
        <div key={mIndex} className="count-type-card-extend w-full">
            <div className="count-type-card">
                <div className="flex justify-between w-full" onClick={() => toggleExpand(mIndex)}>
                    <p className="text-b1">{getTypeURLName(msg?.['@type']) || msg?.['@type']}</p>
                    <Image
                        src="/down-arrow.svg"
                        width={24}
                        height={24}
                        alt="drop-icon"
                        className={`transition-transform duration-500 ease-in-out ${expandedIndex === mIndex ? 'rotate-180' : ''
                            }`}
                    />
                </div>
            </div>
            {expandedIndex === mIndex && (
                <>
                    {renderMessageDetails()}
                    {msgType === MSG_AUTHZ_EXEC &&
                        get(msg, 'msgs', []).map((m: NewMsg, index: number) => (
                            <TxMsg
                                key={index}
                                msg={m}
                                mIndex={index}
                                chainID={chainID}
                                expandedIndex={expandedIndex}
                                toggleExpand={toggleExpand}
                            />
                        ))}
                </>
            )}
        </div>
    );
};

export default TxMsg;
