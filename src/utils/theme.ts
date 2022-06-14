import { getPalletByNetwork } from '../utils/pallet';
import { createTheme } from '@mui/material/styles';

export function isDarkMode() : boolean{
    const mode = localStorage.getItem("DARK_MODE");
    if (mode === "false") {
        return false;
    } else {
        return true;
    }
}

export function getPallet() {
    const network = localStorage.getItem("LAST_SELECTED");
    const pallet = getPalletByNetwork(network);
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