import { ValidatorLogoProps } from '@/types/staking';
import { VALIDATOR_LOGO_URL } from '@/utils/constants';
import { ERR_UNKNOWN, GET_VALIDATOR_LOGO_ERROR } from '@/utils/errors';
import { Avatar } from '@mui/material';
import Axios, { AxiosError } from 'axios';
import { get } from 'lodash';
import React, { useEffect, useState } from 'react';

const ValidatorLogo = ({ identity, width, height }: ValidatorLogoProps) => {
  const [validatorPic, setValidatorPic] = useState<string>('');
  useEffect(() => {
    (async () => {
      try {
        const { status, data } = await Axios.get(VALIDATOR_LOGO_URL(identity));

        if (status === 200) {
          setValidatorPic(get(data, 'them[0].pictures.primary.url'));
        } else {
          setValidatorPic('');
        }
      } catch (error) {
        if (error instanceof AxiosError)
          console.log(GET_VALIDATOR_LOGO_ERROR, error.message);
        console.log(GET_VALIDATOR_LOGO_ERROR, ERR_UNKNOWN);
      }
    })();
  }, [identity]);
  return (
    <>
      <Avatar src={validatorPic} sx={{ width: width, height: height }} />
    </>
  );
};

export default ValidatorLogo;
