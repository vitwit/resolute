import React from 'react';
import Validator from './Validator';

const page = ({ params }: { params: { validator: string } }) => {
  return <Validator moniker={decodeURIComponent(params.validator)} />;
};

export default page;
