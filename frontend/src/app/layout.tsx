import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { Landingpage } from '@/components/LandingPage';
import { StoreProvider } from '@/store/StoreProvider';
import SideBar from '@/components/SideBar';
import SnackBar from '@/components/SnackBar';
import Script from 'next/script';

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
              <SnackBar />
              <Landingpage>
                <SideBar> {children}</SideBar>
              </Landingpage>
            </div>
          </StoreProvider>
        }
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-RTXGXXDNNS" />
        <Script id="google-analytics">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
 
          gtag('config', 'G-RTXGXXDNNS');
        `}
        </Script>
      </body>
    </html>
  );
}
