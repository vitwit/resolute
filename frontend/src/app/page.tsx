'use client'

import { usePathname } from 'next/navigation'
import React from "react";
import Image from "next/image";
import AccountDetails from "./../components/AccountDetails";
import TopNav from "./../components/TopNav";
import BalanceOverview from "./../components/BalanceOverview";
import AssetsTable from "./../components/AssetsTable";





const OverviewPage = () => {
  return (
    <div className="page space-y-10">
      <AccountDetails />
      <BalanceOverview />
     
      
      
      
    
     
      
      <div className="space-y-6">
        <div className="table-title">
          <div className="table-title-content">Asset Information</div>
          <div className="flex">
            <Image
              src="/tableView.svg"
              height={32}
              width={32}
              alt="table view"
            ></Image>
            <Image
              src="/chartView.svg"
              height={32}
              width={32}
              alt="chart view"
            ></Image>
          </div>
        </div>
      </div>
      <AssetsTable />
    </div>
  );
};

export default OverviewPage;
