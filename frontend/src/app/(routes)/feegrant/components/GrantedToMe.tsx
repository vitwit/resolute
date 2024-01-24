import React from 'react';

const GrantedToMe = ({ chainIDs }: { chainIDs: string[] }) => {
  return <div>{JSON.stringify(chainIDs)}</div>;
};

export default GrantedToMe;
