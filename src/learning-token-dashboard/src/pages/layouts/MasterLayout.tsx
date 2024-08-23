import { FC, Suspense } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import ProtectedLayout from "./ProtectedLayout";

const MasterLayout: FC = () => {
  return (
    <>
      <ProtectedLayout>
        <Topbar />
        <Sidebar />
        <div className="ml-[250px] mt-[75px] p-3">
          <Suspense fallback={<div>Loading...</div>}>
            <Outlet />
          </Suspense>
        </div>
      </ProtectedLayout>
    </>
  );
};

export default MasterLayout;
