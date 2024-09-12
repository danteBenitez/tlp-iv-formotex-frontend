import Sidebar from "@/features/inventory/componentes/sidebar";
import { Outlet } from "react-router-dom";

export default function InventoryLayout() {
  return (
    <div className="flex h-full">
      <Sidebar />
      <Outlet />
    </div>
  );
}
