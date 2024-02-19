import React from 'react';
import ValidatorProfile from './ValidatorProfile';
import '../../validator-profile.css';
import '../../staking.css';

const page = ({ params }: { params: { validator: string } }) => {
  return <ValidatorProfile moniker={decodeURIComponent(params.validator)} />;
};

export default page;
