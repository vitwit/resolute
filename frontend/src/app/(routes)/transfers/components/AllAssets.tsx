import React, { useState } from 'react';
import DialogAllAssets from './DialogAllAssets';

const AllAssets = ({
  assets,
  selectedAsset,
  onSelectAsset,
}: {
  assets: ParsedAsset[];
  selectedAsset: ParsedAsset | undefined;
  onSelectAsset: (asset: ParsedAsset) => void;
}) => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const handleDialogClose = () => setDialogOpen(false);
  
  return (
    <div>
      <div className="w-fill flex justify-center h-6 text-[#c3c2c9] text-xs not-italic font-normal leading-6 underline">
        {assets.length > 4 ? (
          <div className=" cursor-pointer" onClick={() => setDialogOpen(true)}>
            View All
          </div>
        ) : (
          ''
        )}
      </div>
      <DialogAllAssets
        dialogOpen={dialogOpen}
        assets={assets}
        selectedAsset={selectedAsset}
        onSelectAsset={onSelectAsset}
        handleDialogClose={handleDialogClose}
      />
    </div>
  );
};

export default AllAssets;
