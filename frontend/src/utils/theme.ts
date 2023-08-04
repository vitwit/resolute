import { getPalletByNetwork } from '../utils/pallet';
import { createTheme } from '@mui/material/styles';
import { networks } from './chainsInfo';
import { KEY_DARK_MODE } from './localStorage';

export function isDarkMode(): boolean {
    const mode = localStorage.getItem(KEY_DARK_MODE);
    if (mode === "false") {
        return false;
    } else {
        return true;
    }
}

export function getPallet() {
    const network = networks[0];
    const pallet = getPalletByNetwork(network?.config.chainName);
    return pallet
}

export const mdTheme = (isDarkMode: boolean, primary: any, secondary: any) => createTheme({
    palette: {
        mode: isDarkMode ? 'dark' : 'light',
        primary: primary,
        secondary: secondary,
    },
    typography: {
        fontFamily: [
            'Nunito',
            'sans-serif',
            '-apple-system',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
    },

});