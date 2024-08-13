import CustomDialog from '@/components/common/CustomDialog';
import React from 'react';
import Image from 'next/image';
import { getMsgNameFromAuthz } from '@/utils/authorizations';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { getTimeDifferenceToFutureDate } from '@/utils/dataTime';

const DialogViewDetails = ({
  onClose,
  open,
  AddressGrants,
  chainID,
  address
}: {
  open: boolean;
  onClose: () => void;
  AddressGrants: Authorization[],
  chainID: string,
  address: string
}) => {

  const { getChainInfo, getDenomInfo } = useGetChainInfo();
  const { chainLogo } = getChainInfo(chainID);

  const { decimals, displayDenom, minimalDenom } = getDenomInfo(chainID)

  const getParseAmounts = (amount: Coin[]) => {
    let total = 0;
    amount && amount.map(c => {
      if (c?.denom === minimalDenom)
        total += Number(c.amount)
    })

    return (total / 10 ** decimals)
  }

  const getParseAmount = (amount?: Coin | null) => {
    return amount?.amount ? (Number(amount?.amount) / 10 ** decimals) : 0
  }

  return (
    <CustomDialog
      open={open}
      title={address}
      onClose={onClose}
      styles="w-[800px]"
    >
      <div className="flex flex-col w-full items-center gap-6">
        <div className=" flex justify-between gap-10">

          {
            AddressGrants?.map((g, ig) => (
              <div key={ig} className="dialog-permission">
                <div className="dialog-permission-header items-start">
                  <Image
                    src={chainLogo}
                    width={24}
                    height={24}
                    alt="network-logo"
                  />
                  {
                    getMsgNameFromAuthz(g)
                  }

                </div>
                {
                  g?.authorization?.['@type'] === '/cosmos.bank.v1beta1.SendAuthorization' && <>
                    <div className="flex gap-2 px-6">
                      <p className="w-[100px] text-small-light">Spend Limit</p>
                      <p className="text-b1">{getParseAmounts(g?.authorization?.spend_limit)} {displayDenom}</p>
                    </div>

                  </> ||
                  g?.authorization?.['@type'] === '/cosmos.staking.v1beta1.StakeAuthorization' && <>
                    <div className="flex gap-2 px-6">
                      <p className="w-[100px] text-small-light">Max Tokens</p>
                      <p className="text-b1">{getParseAmount(g?.authorization?.max_tokens)} {displayDenom}</p>
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
                }

                <div className="flex gap-2 px-6">
                  <p className="w-[100px] text-small-light">Expiry</p>
                  <p className="text-b1">{getTimeDifferenceToFutureDate(g?.expiration || '')}</p>
                </div>

              </div>
            ))
          }

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
      </div>
    </CustomDialog>
  );
};

export default DialogViewDetails;