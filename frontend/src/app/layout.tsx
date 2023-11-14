import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { ConnectWalletButton } from '../components/ConnectWalletButton';
import { StoreProvider } from 'staking/store/StoreProvider';
import SideBar from 'staking/components/SideBar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Resolute',
  description: 'resolute',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {
          <StoreProvider>
            <div className="layout">
              <ConnectWalletButton>
                <SideBar> {children}</SideBar>
              </ConnectWalletButton>
            </div>
          </StoreProvider>
        }
      </body>
    </html>
  );
}
