import { PubKeyFields } from '@/types/multisig';
import React, { ChangeEvent } from 'react';
import MultisigMemberTextField from '../MultisigMemberTextField';
import AddMemberButton from './AddMembersButton';

const AddMembers = ({
  handleChangeValue,
  handleRemoveValue,
  importMultisig,
  pubKeyFields,
  togglePubKey,
  handleAddPubKey,
}: {
  pubKeyFields: PubKeyFields[];
  handleRemoveValue: (i: number) => void;
  handleChangeValue: (
    index: number,
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  togglePubKey: (index: number) => void;
  importMultisig: boolean;
  handleAddPubKey: () => void;
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="text-b1-light !font-light">Add Members</div>
        <div className="add-members">
          {pubKeyFields.map((field, index) => (
            <div>
              <MultisigMemberTextField
                key={index}
                handleRemoveValue={handleRemoveValue}
                handleChangeValue={handleChangeValue}
                index={index}
                field={field}
                togglePubKey={togglePubKey}
                isImport={importMultisig}
              />
            </div>
          ))}
        </div>
      </div>
      {!importMultisig && <AddMemberButton handleAddPubKey={handleAddPubKey} />}
    </div>
  );
};

export default AddMembers;
