import React from 'react';
import DialogAllAssets from './DialogAllAssets';

const AllAssets = ({
  assets,
  selectedAsset,
  onSelectAsset,
  dialogOpen,
  setDialogOpen,
}: {
  assets: ParsedAsset[];
  selectedAsset: ParsedAsset | undefined;
  onSelectAsset: (asset: ParsedAsset, index: number) => void;
  dialogOpen: boolean;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const handleDialogClose = () => setDialogOpen(false);

  return (
    <div>
      {assets.length > 4 ? (
        <div
          className="cursor-pointer w-fill flex justify-center h-6 text-[#c3c2c9] text-xs not-italic font-normal leading-6 underline"
          onClick={() => setDialogOpen(true)}
        >
          View All
        </div>
      ) : null}

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
