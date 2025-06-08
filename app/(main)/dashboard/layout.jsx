import React, { Suspense } from "react";
import DashboardPage from "./page";
import Loading from "@/components/loading";

export const metadata = {
  title: "Dashboard",
};

const DashboardLayout = () => {
  return (
    <div className="px-5">
      <h1 className="text-6xl font-bold gradient-title">Dashboard Page</h1>
      {/* {Dashboard Page} */}
      {/* Suspense is used to fetch api and handle fallback like while data come it show loading */}
      <Suspense fallback={<Loading />}>
        <DashboardPage />
      </Suspense>
    </div>
  );
};

export default DashboardLayout;
