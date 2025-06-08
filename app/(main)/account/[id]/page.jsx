import { getAccountWithTransactions } from "@/actions/accounts";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";
import Loading from "@/components/loading";
import { TransactionTable } from "../_components/transaction-table";
import AccountChart from "../_components/account-chart";

export const metadata = {
  title: "Account",
};

export default async function AccountPage({ params }) {
  const { id } = await params;
  const accountData = await getAccountWithTransactions(id);
  console.log("Account Daata:", accountData);
  if (!accountData) {
    notFound();
  }

  const { transactions, ...account } = accountData;

  return (
    <div className="space-y-8 px-5">
      <div className="flex px-5 gap-4 items-end justify-between">
        <div>
          <h1 className="text-5xl sm:text-6xl font-bold gradient-title capitalize">
            {account.name}
          </h1>
          <p className="text-muted-foreground">
            {account.type.charAt(0).toUpperCase() +
              account.type.slice(1).toLowerCase()}{" "}
            Account
          </p>
        </div>

        <div className="text-right pb-2">
          <div className="text-xl sm:text-2xl font-bold">
            ₹{parseFloat(account.balance).toFixed(2)}
          </div>
          <p className="text-sm text-muted-foreground">
            {account._count.transactions} Transactions
          </p>
        </div>
      </div>
      {/* Chart Section */}
      <Suspense fallback={<Loading />}>
        <AccountChart transactions={transactions} />
      </Suspense>

      {/* Transaction Table */}
      <Suspense fallback={<Loading />}>
        <TransactionTable transactions={transactions} />
      </Suspense>
    </div>
  );
}
