import React from 'react';
import ValidatorProfile from './ValidatorProfile';
import '../validator-profile.css';
import '../../staking/staking.css';
import { VITWIT, WITVAL } from '@/utils/constants';

const page = ({ params }: { params: { validator: string } }) => {
  const decodedMonikerName = decodeURIComponent(params.validator);
  const monikerName =
    decodedMonikerName.toLowerCase() === VITWIT
      ? WITVAL
      : decodedMonikerName.toLocaleLowerCase();
  return <ValidatorProfile moniker={monikerName} />;
};

export default page;
