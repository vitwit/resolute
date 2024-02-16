import React from 'react';
import ValidatorProfile from './ValidatorProfile';
import '../../validator-profile.css';

const page = ({ params }: { params: { validator: string } }) => {
  return <ValidatorProfile moniker={decodeURIComponent(params.validator)} />;
};

export default page;
