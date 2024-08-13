import CustomDialog from '@/components/common/CustomDialog';
import React, { useEffect } from 'react';
import Image from 'next/image';
import { getMsgNameFromAuthz, getTypeURLFromAuthorization } from '@/utils/authorizations';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { getTimeDifferenceToFutureDate } from '@/utils/dataTime';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import useGetAuthzRevokeMsgs from '@/custom-hooks/useGetAuthzRevokeMsgs';
import { RootState } from '@/store/store';
import { TxStatus } from '@/types/enums';
import { txAuthzRevoke } from '@/store/features/authz/authzSlice';

const DialogViewDetails = ({
  onClose,
  open,
  AddressGrants,
  chainID,
  address,
  revoke,
}: {
  open: boolean;
  onClose: () => void;
  AddressGrants: Authorization[];
  chainID: string;
  address: string;
  revoke: boolean;
}) => {
  const { getChainInfo, getDenomInfo } = useGetChainInfo();
  const { chainLogo } = getChainInfo(chainID);

  const { decimals, displayDenom, minimalDenom } = getDenomInfo(chainID);

  const getParseAmounts = (amount: Coin[]) => {
    let total = 0;
    amount &&
      amount.map((c) => {
        if (c?.denom === minimalDenom) total += Number(c.amount);
      });

    return total / 10 ** decimals;
  };

  const getParseAmount = (amount?: Coin | null) => {
    return amount?.amount ? Number(amount?.amount) / 10 ** decimals : 0;
  };

  const dispatch = useAppDispatch();

  let allTypeUrls: string[] = []

  let granter = '', grantee = '';

  AddressGrants.forEach(a => {
    allTypeUrls = [...allTypeUrls, getTypeURLFromAuthorization(a)]
    grantee = a.grantee
    granter = a.granter
  })

  const { txRevokeAuthzInputs } = useGetAuthzRevokeMsgs({
    granter: granter,
    grantee: grantee,
    chainID,
    typeURLs: allTypeUrls,
  });

  const { basicChainInfo, denom, feeAmount, feegranter, msgs } =
    txRevokeAuthzInputs;

  const loading = useAppSelector(
    (state: RootState) => state.authz.chains?.[chainID].tx.status
  );

  useEffect(() => {
    if (loading === TxStatus.IDLE) {
      onClose();
    }
  }, [loading]);

  const handleDelete = () => {
    dispatch(
      txAuthzRevoke({
        basicChainInfo,
        denom,
        feeAmount,
        feegranter,
        msgs,
      })
    );

  };


  return (
    <CustomDialog
      open={open}
      title={address}
      onClose={onClose}
      styles="w-[800px]"
    >
      <div className="flex flex-col w-full items-center gap-6">
        <div className="grid grid-cols-2 gap-10 w-full">
          {AddressGrants?.map((g, index) => {
            //TODO: check is the grant is stake authorization or not
            const isStakeAuthz = false;
            return (
              <div
                key={index}
                className={`dialog-permission ${isStakeAuthz ? 'col-span-2' : ''}`}
              >
                <div className="dialog-permission-header items-start">
                  <Image
                    src={chainLogo}
                    width={24}
                    height={24}
                    alt="network-logo"
                  />
                  {getMsgNameFromAuthz(g)}
                </div>
                {(g?.authorization?.['@type'] ===
                  '/cosmos.bank.v1beta1.SendAuthorization' && (
                    <>
                      <div className="flex gap-2 px-6">
                        <p className="w-[100px] text-small-light">Spend Limit</p>
                        <p className="text-b1">
                          {getParseAmounts(g?.authorization?.spend_limit)}{' '}
                          {displayDenom}
                        </p>
                      </div>
                    </>
                  )) ||
                  (g?.authorization?.['@type'] ===
                    '/cosmos.staking.v1beta1.StakeAuthorization' && (
                      <>
                        <div className="flex gap-2 px-6">
                          <p className="w-[100px] text-small-light">Max Tokens</p>
                          <p className="text-b1">
                            {getParseAmount(g?.authorization?.max_tokens)}{' '}
                            {displayDenom}
                          </p>
                        </div>
                        {/* <div className="flex gap-2 px-6">
                      <p className="w-[100px] text-small-light">Allow Addresses</p>
                      {
                        g?.authorization?.allow_list?.address?.map(a => (
                          <p className="text-b1">{a}</p>
                        ))
                      }

                    </div> */}
                      </>
                    ))}

                <div className="flex gap-2 px-6">
                  <p className="w-[100px] text-small-light">Expiry</p>
                  <p className="text-b1">
                    {getTimeDifferenceToFutureDate(g?.expiration || '')}
                  </p>
                </div>
              </div>
            );
          })}

          {/* <div className="dialog-permission">
            <div className="dialog-permission-header items-start">
              <Image
                src="/akash.png"
                width={24}
                height={24}
                alt="network-logo"
              />
              <p className="text-b1">Grant Authz</p>
            </div>
            <div className="flex gap-2 px-6">
              <p className="w-[100px] text-small-light">Expiry</p>
              <p className="text-b1">23rd March 2024, 11:23 pm</p>
            </div>
          </div> */}
        </div>
        {/* <div className="dialog-permission w-full">
          <div className="dialog-permission-header items-start">
            <Image src="/akash.png" width={24} height={24} alt="network-logo" />
            <p className="text-b1">Send</p>
          </div>
          <div className="flex justify-between gap-20 w-full">
            <div className="flex flex-col gap-4">
              <div className="flex gap-2 px-6">
                <p className="w-[100px] text-small-light">Spend Limit</p>
                <p className="text-b1">120 AKT</p>
              </div>
              <div className="flex gap-2 px-6">
                <p className="w-[100px] text-small-light">Expiry</p>
                <p className="text-b1">23rd March 2024, 11:23 pm</p>
              </div>
            </div>
            <div className="flex gap-4 px-6">
              <p className="text-small-light">Validator List (Deny)</p>
              <div className="flex flex-col gap-2">
                {['Vitwit', 'Stakefish', 'Polkachu'].map((validator, index) => (
                  <div className="flex gap-2" key={index}>
                    <Image
                      src="/akash.png"
                      width={16}
                      height={16}
                      alt="validator-logo"
                    />
                    <p className='text-b1'>{validator}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div> */}

        {
          revoke && (loading === TxStatus.PENDING ?
            <button className='primary-btn w-full'>Loading...</button> :
            <button className='primary-btn w-full' onClick={handleDelete}>Revoke All</button>) || null
        }
      </div>
    </CustomDialog>
  );
};

export default DialogViewDetails;