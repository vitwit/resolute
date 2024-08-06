import useInitFeegrant from '@/custom-hooks/useInitFeegrant';
import React, { useState } from 'react';
import FeegrantFilters from './components/FeegrantFilters';
import FeegrantsToMe from './components/FeegrantsToMe';
import FeegrantsByMe from './components/FeegrantsByMe';

const FeegrantPage = ({ chainIDs }: { chainIDs: string[] }) => {
  useInitFeegrant({ chainIDs });

  const [isGrantedToMe, setIsGrantedToMe] = useState(true);

  const handleFilterChange = (value: boolean) => {
    setIsGrantedToMe(value);
  };

  return (
    <div className="w-full px-6">
      <FeegrantFilters
        isGrantsToMe={isGrantedToMe}
        handleFilterChange={handleFilterChange}
      />
      {isGrantedToMe ? (
        <FeegrantsToMe chainIDs={chainIDs} />
      ) : (
        <FeegrantsByMe chainIDs={chainIDs} />
      )}
    </div>
  );
};

export default FeegrantPage;
