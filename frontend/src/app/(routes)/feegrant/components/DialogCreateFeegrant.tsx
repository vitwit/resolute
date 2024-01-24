import { useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import { dialogBoxPaperPropStyles } from '@/utils/commonStyles';
import { CLOSE_ICON_PATH } from '@/utils/constants';
import { Dialog, DialogContent } from '@mui/material';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import NetworkItem from '../../authz/components/NetworkItem';
import { FieldValues, useForm } from 'react-hook-form';
import CreateFeegrantForm from './CreateFeegrantForm';
import { getFeegrantFormDefaultValues } from '@/utils/feegrant';

interface DialogCreateFeegrantProps {
  open: boolean;
  onClose: () => void;
}

const DialogCreateFeegrant: React.FC<DialogCreateFeegrantProps> = (props) => {
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
  const [isPeriodic, setIsPeriodic] = useState<boolean>(false);
  const [viewAllChains, setViewAllChains] = useState<boolean>(false);
  const [selectedMsgs, setSelectedMsgs] = useState<string[]>([]);
  const [allTxns, setAllTxns] = useState<boolean>(true);

  const handleDialogClose = () => {
    onClose();
  };

  const handleSelectChain = (chainID: string) => {
    const updatedSelection = selectedChains.includes(chainID)
      ? selectedChains.filter((id) => id !== chainID)
      : [...selectedChains, chainID];

    setSelectedChains(updatedSelection);
  };

  const handleSelectMsg = (msgType: string) => {
    const updatedSelection = selectedMsgs.includes(msgType)
      ? selectedMsgs.filter((id) => id !== msgType)
      : [...selectedMsgs, msgType];

    setSelectedMsgs(updatedSelection);
  };

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: getFeegrantFormDefaultValues(),
  });

  const onSubmit = (e: FieldValues) => {
    console.log(e);
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
      onClose={handleDialogClose}
      maxWidth="lg"
      PaperProps={{
        sx: dialogBoxPaperPropStyles,
      }}
    >
      <DialogContent sx={{ padding: 0 }}>
        <div className="w-[890px] text-white">
          <div className="px-10 pb-6 pt-10 flex justify-end">
            <div onClick={handleDialogClose}>
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
            </div>
            <div className="divider-line"></div>
            <>
              <div>
                <div className="space-y-4">
                  <div className="text-[16px]">Select Networks</div>
                  <div className="networks-list">
                    {displayedChains.map((chainID, index) => (
                      <NetworkItem
                        key={index}
                        chainName={networks[chainID].network.config.chainName}
                        logo={networks[chainID].network.logos.menu}
                        onSelect={handleSelectChain}
                        selected={selectedChains.includes(chainID)}
                        chainID={chainID}
                        disable={false}
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
                      {viewAllChains ? 'View less' : 'View all'}
                    </button>
                  </div>
                </div>
                <div className="mt-10">
                  <form
                    onSubmit={handleSubmit((e) => onSubmit(e))}
                    id="create-feegrant-form"
                  >
                    <CreateFeegrantForm
                      control={control}
                      errors={errors}
                      isPeriodic={isPeriodic}
                      setIsPeriodic={(value: boolean) => setIsPeriodic(value)}
                      handleSelectMsg={handleSelectMsg}
                      selectedMsgs={selectedMsgs}
                      allTxns={allTxns}
                      setAllTxns={(value: boolean) => setAllTxns(value)}
                    />
                  </form>
                </div>
                <div className="mt-10 flex justify-end text-right">
                  <button
                    type="submit"
                    form="create-feegrant-form"
                    className="primary-custom-btn w-[186px]"
                  >
                    Create Grant
                  </button>
                </div>
              </div>
            </>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogCreateFeegrant;
