import React from 'react';

const FeegrantTypeBadge = ({ isPeriodic }: { isPeriodic: boolean }) => {
  return (
    <div className={`feegrant-badge ${isPeriodic ? 'periodic-badge' : 'basic-badge'}`}>
      {isPeriodic ? 'Periodic' : 'Basic'}
    </div>
  );
};

export default FeegrantTypeBadge;
