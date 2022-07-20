import { getPalletByNetwork } from '../utils/pallet';
import { createTheme } from '@mui/material/styles';
import { getSelectedNetwork } from './networks';

export function isDarkMode() : boolean{
    const mode = localStorage.getItem("DARK_MODE");
    if (mode === "false") {
        return false;
    } else {
        return true;
    }
}

export function getPallet() {
    const network = getSelectedNetwork();
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
            'Roboto',
            'Ubuntu',
            'sans-serif',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            '"Helvetica Neue"',
            'Arial',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
    },

});