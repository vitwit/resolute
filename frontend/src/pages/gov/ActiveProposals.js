import React, { useEffect, useState } from 'react'
import Proposals from './Proposals'
import { useDispatch, useSelector } from 'react-redux';
import ConnectWallet from '../../components/ConnectWallet';
import { Typography } from '@mui/material';

const filterVoteAuthz = (authzs) => {
  const result = {};
  const ids = Object.keys(authzs);
  for (let i = 0; i < ids.length; i++) {
    const granters = [];
    const chainID = ids[i];
    for (let j = 0; j < authzs[chainID]?.grants?.length; j++) {
      const grant = authzs[chainID]?.grants[j];
      if (grant?.authorization["@type"] === "/cosmos.authz.v1beta1.GenericAuthorization" &&
        grant?.authorization.msg === "/cosmos.gov.v1beta1.MsgVote") {
        granters.push(grant.granter);
      }
    }
    result[chainID] = granters;
  }

  return result;
}

function ActiveProposals() {

  const [isNoAuthzs, setNoAuthzs] = useState(false);
  const [authzGrants, setAuthzGrants] = useState({});

  const walletConnected = useSelector((state) => state.wallet.connected);
  const networks = useSelector((state) => state.wallet.networks);
  const grantsToMe = useSelector((state) => state.authz.grantsToMe);
  const isAuthzMode = useSelector((state) => state.common.authzMode);


  useEffect(() => {
    const result = filterVoteAuthz(grantsToMe);
    if (Object.keys(result).length === 0) {
      setNoAuthzs(true);
    } else {
      setNoAuthzs(false);
      setAuthzGrants(result);
    }
  }, [grantsToMe]);

  return (
    <>
      {
        walletConnected ?
          <>
            {
              isAuthzMode && isNoAuthzs ?
                <Typography>
                  You don't have authz permission.
                </Typography>
                :
                Object.keys(networks).map((key, index) => (
                  <>
                    <Proposals
                      restEndpoint={networks[key].network?.config?.rest}
                      chainName={networks[key].network?.config?.chainName}
                      chainLogo={networks[key]?.network?.logos?.menu}
                      signer={networks[key].walletInfo?.bech32Address}
                      gasPriceStep={networks[key].network?.config?.gasPriceStep}
                      aminoConfig={networks[key].network.aminoConfig}
                      bech32Config={networks[key].network?.config.bech32Config}
                      chainID={networks[key].network?.config?.chainId}
                      currencies={networks[key].network?.config?.currencies}
                      authzMode={isAuthzMode}
                      grantsToMe={authzGrants[networks[key].network?.config?.chainId]}
                      key={index}
                    />
                  </>
                ))
            }

          </>
          :
          <ConnectWallet />
      }
    </>
  )
}

export default ActiveProposals
