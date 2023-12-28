import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { Landingpage } from '@/components/LandingPage';
import { StoreProvider } from '@/store/StoreProvider';
import SideBar from '@/components/SideBar';

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
              <Landingpage>
                <SideBar> {children}</SideBar>
              </Landingpage>
            </div>
          </StoreProvider>
        }
      </body>
    </html>
  );
}
