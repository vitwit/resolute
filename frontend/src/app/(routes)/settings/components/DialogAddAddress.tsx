import React from 'react';
import CustomDialog from '../../../../components/common/CustomDialog';
import { TextField } from '@mui/material';
import { customTransferTextFieldStyles } from '../../transfers/styles';

const DialogAddAddress = ({
  onClose,
  open,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  return (
    <CustomDialog
      open={open}
      title="Add Address"
      onClose={onClose}
      styles="w-[800px]"
      description="Connect your wallet now to access all the modules on resolute "
    >
      <div className="space-y-6 w-full">
        <div className="gap-1">
          <div className="form-label-text">Name</div>
          <TextField
            className="bg-transparent rounded-full border-[1px] border-[#ffffff80] h-10"
            fullWidth
            type="text"
            sx={customTransferTextFieldStyles}
          />
        </div>
        <div className="gap-1">
          <div className="form-label-text">Address</div>
          <TextField
            className="bg-transparent rounded-full border-[1px] border-[#ffffff80] h-10"
            fullWidth
            type="text"
            sx={customTransferTextFieldStyles}
          />
        </div>
        <button className="primary-btn w-full">Add</button>
      </div>
    </CustomDialog>
  );
};

export default DialogAddAddress;

// import React, { useState } from 'react';
// import CustomDialog from '../../../../components/common/CustomDialog';

// const DialogAddAddress = ({
//   onClose,
//   open,
// }: {
//   open: boolean;
//   onClose: () => void;
// }) => {
//   const [name, setName] = useState('');
//   const [address, setAddress] = useState('');

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     // Handle form submission here
//     console.log('Name:', name);
//     console.log('Address:', address);

//     // Clear the form fields after submission
//     setName('');
//     setAddress('');
//     onClose(); // Close the dialog after submission
//   };

//   return (
//     <CustomDialog
//       open={open}
//       title="Add Address"
//       onClose={onClose}
//       styles="w-[800px]"
//       description="Connect your wallet now to access all the modules on resolute"
//     >
//       <form onSubmit={handleSubmit} className="space-y-6 w-full">
//         <div>
//           <label htmlFor="name" className="block text-b1-light">Name</label>
//           <input
//             id="name"
//             type="text"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className="mt-1 block w-full px-3 py-2 border rounded-md"
//             required
//           />
//         </div>
//         <div>
//           <label htmlFor="address" className="block text-b1-light">Address</label>
//           <input
//             id="address"
//             type="text"
//             value={address}
//             onChange={(e) => setAddress(e.target.value)}
//             className="mt-1 block w-full px-3 py-2 border"
//             required
//           />
//         </div>
//         <div className="space-y-6">
//           <button
//             type="submit"
//             className="primary-btn w-full"
//           >
//             Add
//           </button>
//         </div>
//       </form>
//     </CustomDialog>
//   );
// };

// export default DialogAddAddress;
