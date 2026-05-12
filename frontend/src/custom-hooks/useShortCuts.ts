import { useEffect } from 'react';
import { useAppDispatch } from './StateHooks';
import { setChangeNetworkDialogOpen } from '@/store/features/common/commonSlice';

const useShortCuts = () => {
  const dispatch = useAppDispatch();

  // Open select network dialog on '/' key press
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === '/') {
        const activeElement = document.activeElement as HTMLElement;
        if (
          activeElement.tagName !== 'INPUT' &&
          activeElement.tagName !== 'TEXTAREA'
        ) {
          event.preventDefault();
          dispatch(
            setChangeNetworkDialogOpen({ open: true, showSearch: true })
          );
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [dispatch]);
};

export default useShortCuts;
