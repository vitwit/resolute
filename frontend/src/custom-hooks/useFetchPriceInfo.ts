import { useEffect } from 'react';
import { useAppDispatch } from './StateHooks';
import { getAllTokensPrice } from '@/store/features/common/commonSlice';

const interval = 300000; // 5 minutes

/**
 * Custom hook to fetch token price information at regular intervals.
 * 
 * This hook dispatches the `getAllTokensPrice` action immediately upon component mount 
 * and then repeatedly every 5 minutes (300,000 milliseconds) to keep the token prices 
 * updated in the Redux store.
 * 
 * Usage:
 * 
 * ```
 * import useFetchPriceInfo from './path/to/useFetchPriceInfo';
 * 
 * const MyComponent = () => {
 *   useFetchPriceInfo();
 *   
 *   return (
 *     <div>My Component</div>
 *   );
 * };
 * ```
 * 
 * Dependencies:
 * - `useAppDispatch`: A custom hook to access the Redux `dispatch` function.
 * - `getAllTokensPrice`: An asynchronous thunk action from the `commonSlice` that fetches all token prices.
 * 
 * @returns {void}
 */

const useFetchPriceInfo = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getAllTokensPrice());
    const intervalId = setInterval(() => {
      dispatch(getAllTokensPrice());
    }, interval);
    return () => clearInterval(intervalId);
  }, []);
};

export default useFetchPriceInfo;
