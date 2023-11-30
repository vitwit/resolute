import {
  Dialog,
  DialogContent,
  InputAdornment,
  TextField,
} from '@mui/material';
import Image from 'next/image';
import React, { ChangeEvent, useEffect, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { setError } from '@/store/features/common/commonSlice';
import { useAppDispatch } from '@/custom-hooks/StateHooks';

interface DialogCreateMultisigProps {
  open: boolean;
  onClose: () => void;
  addressPrefix: string;
  chainID: string;
  address: string;
  pubKey: string;
}

interface PubKeyFields {
  name: string;
  value: string;
  label: string;
  placeHolder: string;
  required: boolean;
  disabled: boolean;
}

const InputTextComponent = ({
  field,
  index,
  handleChangeValue,
  handleRemoveValue,
}: any) => {
  return (
    <>
      <TextField
        onChange={(e) => handleChangeValue(index, e)}
        sx={{ mb: 1, mt: 1 }}
        name={field.name}
        value={field.value}
        required={field?.required}
        label={field.label}
        placeholder={field.placeHolder}
        fullWidth
        disabled={field.disabled}
        InputProps={{
          endAdornment: (
            <InputAdornment
              onClick={() =>
                !field.disabled
                  ? handleRemoveValue(index)
                  : alert('cannot self remove')
              }
              position="end"
              sx={{
                '&:hover': {
                  cursor: 'pointer',
                },
              }}
            >
              <DeleteIcon />
            </InputAdornment>
          ),
        }}
      />
    </>
  );
};

const DialogCreateMultisig = ({
  open,
  onClose,
  address,
  addressPrefix,
  chainID,
  pubKey,
}: DialogCreateMultisigProps) => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [pubKeyFields, setPubKeyFields] = useState<PubKeyFields[]>([]);
  const [threshold, setThreshold] = useState(0);
  const [formError, setFormError] = useState('');

  const pubKeyObj = {
    name: 'pubKey',
    value: '',
    label: 'Public Key (Secp256k1)',
    placeHolder: 'E. g. AtgCrYjD+21d1+og3inzVEOGbCf5uhXnVeltFIo7RcRp',
    required: true,
    disabled: false,
  };

  useEffect(() => {
    setPubKeyFields([
      {
        name: 'current',
        value: pubKey,
        label: 'Public Key (Secp256k1)',
        placeHolder: 'E. g. AtgCrYjD+21d1+og3inzVEOGbCf5uhXnVeltFIo7RcRp',
        required: true,
        disabled: true,
      },
      { ...pubKeyObj },
    ]);
  }, []);

  const handleClose = () => {
    onClose();
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleRemoveValue = (i: number) => {
    if (pubKeyFields.length > 1) {
      pubKeyFields.splice(i, 1);
      setPubKeyFields([...pubKeyFields]);
    }
  };

  const handleChangeValue = (
    index: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const newInputFields = pubKeyFields.map((value, key) => {
      if (index === key) {
        value['value'] = e.target.value;
      }
      return value;
    });

    setPubKeyFields(newInputFields);
  };

  const handleAddPubKey = () => {
    if (pubKeyFields?.length > 6) {
      dispatch(
        setError({
          type: 'error',
          message: "You can't add more than 7 pub keys",
        })
      );
      return;
    } else {
      setPubKeyFields([...pubKeyFields, pubKeyObj]);
    }
  };

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      maxWidth="lg"
      PaperProps={{
        sx: {
          borderRadius: '24px',
          background: 'linear-gradient(90deg, #704290 0.11%, #241b61 70.28%)',
        },
      }}
    >
      <DialogContent sx={{ p: 0 }} className="text-white w-[890px]">
        <div className="w-[890px] pb-12 text-white">
          <div className="px-10 py-6 flex justify-end">
            <div
              onClick={() => {
                handleClose();
              }}
            >
              <Image
                className="cursor-pointer"
                src="/close-icon.svg"
                width={24}
                height={24}
                alt="Close"
              />
            </div>
          </div>
          <div className="flex gap-10 items-center">
            <Image
              src="/multisig-popup-image.png"
              width={336}
              height={298}
              alt="Create Multisig"
            />
            <div className="flex-1 flex flex-col gap-6 pr-10">
              <h2 className="text-[20px] font-bold leading-normal">
                Create Multisig
              </h2>
              <form>
                <TextField
                  onChange={handleNameChange}
                  name="name"
                  value={name}
                  required
                  label="Name"
                  placeholder="Eg: Alice-Bob-Eve-Msig"
                  fullWidth
                />
                {pubKeyFields.map((field, index) => (
                  <InputTextComponent
                    key={index}
                    handleRemoveValue={handleRemoveValue}
                    handleChangeValue={handleChangeValue}
                    index={index}
                    field={field}
                  />
                ))}
                <div className="text-right text-[12px] font-extralight">
                  <span
                    className="border-b cursor-pointer"
                    onClick={handleAddPubKey}
                  >
                    Add New Member
                  </span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogCreateMultisig;
