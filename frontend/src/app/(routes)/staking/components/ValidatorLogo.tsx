import { ERR_UNKNOWN } from '@/utils/errors';
import { Avatar } from '@mui/material';
import Axios, { AxiosError } from 'axios';
import { get } from 'lodash';
import React, { useEffect, useState } from 'react';

const ValidatorLogo = ({
  identity,
  monikerName,
  width,
  height,
}: {
  identity: string;
  monikerName: string;
  width: number;
  height: number;
}) => {
  const [validatorPic, setValidatorPic] = useState<string>('');
  useEffect(() => {
    (async () => {
      try {
        const { status, data } = await Axios.get(
          `https://keybase.io/_/api/1.0/user/lookup.json?key_suffix=${identity}&fields=pictures`
        );

        if (status === 200) {
          setValidatorPic(get(data, 'them[0].pictures.primary.url'));
        } else {
          setValidatorPic('');
        }
      } catch (error) {
        if (error instanceof AxiosError)
          console.log('Error while getting validator logo', error.message);
        console.log('Error while getting validator logo', ERR_UNKNOWN);
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
