import { Paper } from '@mui/material';
import React from 'react';


export default function Balance() {  
    const chainInfo = useSelector((state) => state.wallet.chainInfo);
    const address = useSelector((state) => state.wallet.bech32Address);
  
    useEffect(() => {
      dispatch(getGrantsByMe({
        baseURL: chainInfo.lcd,
        granter: address
      }))
    }, [chainInfo]);


    return (
        <>
            <Paper>
                
            </Paper>
        </>

    );

}