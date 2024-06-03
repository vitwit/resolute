import React from 'react';
import ValidatorProfile from './ValidatorProfile';
import '../validator-profile.css';
import '../../staking/staking.css';
import { VITWIT_NEW_MONIKER, VITWIT_VALIDATOR_NAMES } from '@/utils/constants';

const page = ({ params }: { params: { validator: string } }) => {
  const decodedMonikerName = decodeURIComponent(params.validator);
  // If the moniker name is vitwit or vitwit (previously witval) or witval use new moniker name
  const isVitwitValidator = VITWIT_VALIDATOR_NAMES.includes(
    decodedMonikerName.toLowerCase()
  );
  const monikerName = isVitwitValidator
    ? decodeURIComponent(VITWIT_NEW_MONIKER)
    : decodedMonikerName.toLocaleLowerCase();
  return <ValidatorProfile moniker={monikerName} />;
};

export default page;
