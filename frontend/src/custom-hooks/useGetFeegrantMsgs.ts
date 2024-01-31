import { FieldValues } from 'react-hook-form';
import useGetChainInfo from './useGetChainInfo';
import { FeegrantBasicMsg, FeegrantPeriodicMsg } from '@/txns/feegrant';
import { getAddressByPrefix } from '@/utils/address';
import { amountToMinimalValue } from '@/utils/util';
import { FeegrantFilterMsg } from '@/txns/feegrant/grant';
import { getMsgListFromMsgNames } from '@/utils/feegrant';

interface ChainGrant {
  chainID: string;
  msg: Msg;
}

const useGetFeegrantMsgs = () => {
  const { getChainInfo, getDenomInfo } = useGetChainInfo();

  const getFeegrantMsgs = ({
    isFiltered,
    msgsList,
    selectedChains,
    isPeriodic,
    fieldValues,
  }: {
    isFiltered: boolean;
    msgsList: string[];
    selectedChains: string[];
    isPeriodic: boolean;
    fieldValues: FieldValues;
  }) => {
    const chainWiseGrants: ChainGrant[] = [];
    selectedChains.forEach((chainID) => {
      const { address: granterAddress, prefix } = getChainInfo(chainID);
      const granteeAddress = fieldValues?.grantee_address || '';
      const grantee = getAddressByPrefix(granteeAddress, prefix);
      const { minimalDenom, decimals } = getDenomInfo(chainID);
      const expiration = fieldValues.expiration.toISOString();
      let msg: Msg;
      if (isFiltered) {
        const msgTypeURLs = getMsgListFromMsgNames(msgsList);
        const allowanceType = isPeriodic ? 'Periodic' : 'Basic';
        msg = FeegrantFilterMsg(
          granterAddress,
          grantee,
          minimalDenom,
          amountToMinimalValue(Number(fieldValues.spend_limit), decimals),
          Number(fieldValues.period),
          amountToMinimalValue(
            Number(fieldValues.period_spend_limit),
            decimals
          ),
          expiration,
          msgTypeURLs,
          allowanceType
        );
        chainWiseGrants.push({
          chainID: chainID,
          msg: msg,
        });
      } else if (isPeriodic) {
        msg = FeegrantPeriodicMsg(
          granterAddress,
          grantee,
          minimalDenom,
          amountToMinimalValue(Number(fieldValues.spend_limit), decimals),
          Number(fieldValues.period),
          amountToMinimalValue(
            Number(fieldValues.period_spend_limit),
            decimals
          ),
          expiration
        );
        chainWiseGrants.push({
          chainID: chainID,
          msg: msg,
        });
      } else {
        msg = FeegrantBasicMsg(
          granterAddress,
          grantee,
          minimalDenom,
          amountToMinimalValue(
            Number(fieldValues.spend_limit),
            decimals
          ).toString(),
          expiration
        );
        chainWiseGrants.push({
          chainID: chainID,
          msg: msg,
        });
      }
    });

    return {
      chainWiseGrants,
    };
  };

  return { getFeegrantMsgs };
};

export default useGetFeegrantMsgs;
