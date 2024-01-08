import { useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import { dialogBoxPaperPropStyles } from '@/utils/commonStyles';
import { CLOSE_ICON_PATH } from '@/utils/constants';
import { shortenName } from '@/utils/util';
import { Avatar, Dialog, DialogContent, Tooltip } from '@mui/material';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

interface DialogCreateAuthzGrantProps {
  open: boolean;
  onClose: () => void;
}

const DialogCreateAuthzGrant: React.FC<DialogCreateAuthzGrantProps> = (
  props
) => {
  const { open, onClose } = props;
  const nameToChainIDs = useAppSelector(
    (state: RootState) => state.wallet.nameToChainIDs
  );
  const networks = useAppSelector((state: RootState) => state.wallet.networks);
  const chainIDs = Object.keys(nameToChainIDs).map(
    (chainName) => nameToChainIDs[chainName]
  );
  const [selectedChains, setSelectedChains] = useState<string[]>([]);
  const [displayedChains, setDisplayedChains] = useState<string[]>(
    chainIDs?.slice(0, 5) || []
  );
  const [viewAllChains, setViewAllChains] = useState<boolean>(false);

  const handleSelectChain = (chainID: string) => {
    const updatedSelection = selectedChains.includes(chainID)
      ? selectedChains.filter((id) => id !== chainID)
      : [...selectedChains, chainID];

    setSelectedChains(updatedSelection);
  };

  useEffect(() => {
    if (viewAllChains) {
      setDisplayedChains(chainIDs);
    } else {
      setDisplayedChains(chainIDs?.slice(0, 5) || []);
    }
  }, [viewAllChains]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      PaperProps={{
        sx: dialogBoxPaperPropStyles,
      }}
    >
      <DialogContent sx={{ padding: 0 }}>
        <div className="w-[890px] text-white">
          <div className="px-10 pb-6 pt-10 flex justify-end">
            <div onClick={onClose}>
              <Image
                className="cursor-pointer"
                src={CLOSE_ICON_PATH}
                width={24}
                height={24}
                alt="Close"
                draggable={false}
              />
            </div>
          </div>
          <div className="mb-[72px] px-10">
            <div className="space-y-4">
              <h2 className="text-[20px] font-bold">Create Grant</h2>
              <div className="text-[14px]">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </div>
            </div>
            <div className="divider-line"></div>
            <div>
              <div className="space-y-4">
                <div className="text-[16px]">
                  You are giving Authz access to
                </div>
                <div className="networks-list">
                  {displayedChains.map((chainID, index) => (
                    <NetworkItem
                      key={index}
                      chainName={networks[chainID].network.config.chainName}
                      logo={networks[chainID].network.logos.menu}
                      onSelect={handleSelectChain}
                      selected={selectedChains.includes(chainID)}
                      chainID={chainID}
                    />
                  ))}
                </div>
                <div className="text-center">
                  <button
                    onClick={() => {
                      setViewAllChains((prevState) => !prevState);
                    }}
                    className="text-[14px] leading-[20px] underline underline-offset-2 tracking-[0.56px]"
                  >
                    View all
                  </button>
                </div>
              </div>
              {/* Grantee address */}
              {/* authz msgs list  */}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogCreateAuthzGrant;

const NetworkItem = ({
  chainName,
  logo,
  onSelect,
  selected,
  chainID,
}: {
  chainName: string;
  logo: string;
  onSelect: (chainID: string) => void;
  selected: boolean;
  chainID: string;
}) => {
  return (
    <div
      className={
        selected ? 'network-item network-item-selected' : 'network-item'
      }
      onClick={() => onSelect(chainID)}
    >
      <Avatar src={logo} sx={{ width: 32, height: 32 }} />
      <Tooltip title={chainName} placement="bottom">
        <h3 className={`text-[14px] leading-normal opacity-100`}>
          <span>{shortenName(chainName, 6)}</span>
        </h3>
      </Tooltip>
    </div>
  );
};
