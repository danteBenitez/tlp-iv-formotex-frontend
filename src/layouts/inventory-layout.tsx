import Sidebar from "@/features/inventory/components/sidebar";
import { Outlet } from "react-router-dom";

export default function InventoryLayout() {
  return (
    <div className="grid grid-cols-[18rem_1fr]">
      <Sidebar />
      <div className="pt-4">
        <Outlet />
      </div>
    </div>
  );
}
