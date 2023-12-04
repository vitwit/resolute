import { ValidatorLogoProps } from '@/types/staking';
import { VALIDATOR_LOGO_URL } from '@/utils/constants';
import { Avatar } from '@mui/material';
import Axios from 'axios';
import { get } from 'lodash';
import React, { useEffect, useState } from 'react';

const ValidatorLogo = ({ identity, width, height }: ValidatorLogoProps) => {
  const [validatorPic, setValidatorPic] = useState<string>('');

  useEffect(() => {
    const CancelToken = Axios.CancelToken;
    const source = CancelToken.source();
    (async () => {
      try {
        const { status, data } = await Axios.get(VALIDATOR_LOGO_URL(identity), {
          cancelToken: source.token,
        });

        if (status === 200)
          setValidatorPic(get(data, 'them[0].pictures.primary.url'));
      } catch (error) {
        setValidatorPic('');
      }
    })();

    return () => {
      source.cancel();
    };
  }, [identity]);
  return (
    <>
      <Avatar src={validatorPic} sx={{ width: width, height: height }} />
    </>
  );
};

export default ValidatorLogo;
