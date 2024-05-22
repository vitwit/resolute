import './globals.css';
import type { Metadata, } from 'next';
import { Inter } from 'next/font/google';
import { Landingpage } from '@/components/LandingPage';
import { StoreProvider } from '@/store/StoreProvider';
import SideBar from '@/components/SideBar';
import SnackBar from '@/components/SnackBar';
import Script from 'next/script';
import { OpenGraph } from 'next/dist/lib/metadata/types/opengraph-types';
import OverviewTable from '@/components/OverviewTable';

const inter = Inter({ subsets: ['latin'] });

const openGraph: OpenGraph = {
  title: 'Interchain interface',
  description: 'Resolute is an advanced spacecraft designed to travel through the multiverse, connecting Cosmos sovereign chains.',
  url: 'https://resolute.vitwit.com',
  type: 'website',
}


export const metadata: Metadata = {
  title: 'Resolute',
  description: 'Interchain interface, Resolute is an advanced spacecraft designed to travel through the multiverse, connecting Cosmos sovereign chains.',
  keywords: 'resolute, interchain interface, cosmos, osmosis, regen, akash, celestia, dymension, authz, feegrant, groups, staking, send, ibc send, multisig',
  openGraph
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
              {/* <SnackBar />
              <Landingpage>
                <SideBar> {children}</SideBar>
              </Landingpage> */}
              <OverviewTable address='Cosmori8270jk80....' />
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
