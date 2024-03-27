import { useAppSelector } from './StateHooks';
import useGetAssets from './useGetAssets';
import useGetChains from './useGetChains';

declare let window: WalletWindow;

interface CustomChainData extends ChainData {
  chainName: string;
}

const useAccount = () => {
  const balances = useAppSelector((state) => state.bank.balances);
  const { getTokensByChainID } = useGetAssets();
  const { getChainConfig } = useGetChains();
  const getAccountAddress = async (
    chainID: string
  ): Promise<{ address: string }> => {
    try {
      const account = await window.wallet.getKey(chainID);
      return { address: account.bech32Address };
    } catch (error) {
      const chainConfig = getChainConfig(chainID);
      const chainData: CustomChainData = {
        ...chainConfig,
        chainName: chainConfig.networkName,
      };
      try {
        const account = await window.wallet.experimentalSuggestChain(chainData);
        return { address: account.bech32Address };
      } catch (error) {
        console.log(error);
        return { address: '' };
      }
    }
  };

  const getAvailableBalance = async ({
    chainID,
    denom,
  }: {
    chainID: string;
    denom: string;
  }) => {
    const chainBalances = balances?.[chainID]?.list || [];

    const balanceInfo = {
      amount: 0,
      minimalDenom: '',
      displayDenom: '',
      decimals: 0,
      parsedAmount: 0,
    };

    const chainAssets = await getTokensByChainID(chainID, true);

    chainBalances.forEach((balance) => {
      const filteredDenomInfo = chainAssets?.filter((denomInfo) => {
        return denomInfo.denom === balance.denom;
      });
      const denomInfo = filteredDenomInfo[0];
      if (denomInfo && denomInfo.denom === denom) {
        balanceInfo.amount = parseFloat(balance.amount);
        const precision = denomInfo.decimals || 0 > 6 ? 6 : denomInfo.decimals;
        balanceInfo.decimals = denomInfo.decimals || 0;
        balanceInfo.displayDenom = denomInfo.symbol || '';
        balanceInfo.minimalDenom = denomInfo.denom;

        balanceInfo.parsedAmount = parseFloat(
          (Number(balance.amount) / 10.0 ** (denomInfo.decimals || 0)).toFixed(
            precision
          )
        );
      }
    });

    if (!balanceInfo.minimalDenom || !balanceInfo.displayDenom) {
      const filteredDenomInfo = chainAssets?.filter((denomInfo) => {
        return denomInfo.denom === denom;
      });
      balanceInfo.minimalDenom = filteredDenomInfo[0].denom || '';
      balanceInfo.displayDenom = filteredDenomInfo[0].symbol || '';
      balanceInfo.decimals = filteredDenomInfo[0].decimals || 0;
    }

    return {
      balanceInfo,
    };
  };

  return { getAccountAddress, getAvailableBalance };
};

export default useAccount;
