import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import PermanentSideBar from "../components/PermanentSidebar";
import { ConnectWalletButton } from "../components/ConnectWalletButton";
import { StoreProvider } from "staking/store/StoreProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Resolute",
  description: "resolute",
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
                <PermanentSideBar> {children}</PermanentSideBar>
              </ConnectWalletButton>
            </div>
          </StoreProvider>
        }
      </body>
    </html>
  );
}
