import { useForm } from 'react-hook-form';
import AmountInputField from './AmountInputField';

const DepositForm = () => {
  const { control } = useForm();
  return (
    <div className="cast-vote-grid ">
      <div className="flex px-6 py-4 rounded-2xl bg-[#FFFFFF05] justify-between w-full">
        <p className="text-b1">Deposit</p>
        <p className="text-small-light">Deposit Period ends in 4 days</p>
      </div>
      <div className="space-y-1 w-full">
        <p className="text-b1-light">Enter Amount here</p>
        <AmountInputField control={control} />
      </div>
      <div className="primary-btn w-full">Deposit</div>
    </div>
  );
};
export default DepositForm;
