import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { StoreProvider } from '@/store/StoreProvider';
import SnackBar from '@/components/SnackBar';
import Script from 'next/script';
import { OpenGraph } from 'next/dist/lib/metadata/types/opengraph-types';
import FixedLayout from '@/components/main-layout/FixedLayout';

const inter = Inter({ subsets: ['latin'] });

const openGraph: OpenGraph = {
  title: 'Interchain interface',
  description:
    'Resolute is an advanced spacecraft designed to travel through the multiverse, connecting Cosmos sovereign chains.',
  url: 'https://resolute.vitwit.com',
  type: 'website',
};

export const metadata: Metadata = {
  title: 'Resolute',
  description:
    'Interchain interface, Resolute is an advanced spacecraft designed to travel through the multiverse, connecting Cosmos sovereign chains.',
  keywords:
    'resolute, interchain interface, cosmos, osmosis, regen, akash, celestia, dymension, authz, feegrant, groups, staking, send, ibc send, multisig',
  openGraph,
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
              <FixedLayout>{children}</FixedLayout>
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
