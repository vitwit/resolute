import React from 'react';

const GrantedByMe = ({ chainIDs }: { chainIDs: string[] }) => {
  return <div>{JSON.stringify(chainIDs)}</div>;
};

export default GrantedByMe;
