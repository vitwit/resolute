import React from 'react';
import AuthzFilters from './components/AuthzFilters';
import useInitAuthz from '@/custom-hooks/useInitAuthz';

const AuthzPage = ({ chainIDs }: { chainIDs: string[] }) => {
  useInitAuthz({ chainIDs, shouldFetch: true });

  return <div>
    <AuthzFilters chainIDs={chainIDs} />
  </div>;
};

export default AuthzPage;
