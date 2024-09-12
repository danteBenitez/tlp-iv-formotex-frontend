import useAuth from "@/features/auth/hooks/use-auth";
import { Sidebar as LibSidebar } from "flowbite-react";
import {
  FaBuilding,
  FaClipboardList,
  FaDoorClosed,
  FaLaptop,
} from "react-icons/fa";

export default function Sidebar() {
  const { signOut, isAdmin } = useAuth();
  return (
    <LibSidebar aria-label="Default sidebar example">
      <LibSidebar.Items>
        <LibSidebar.ItemGroup>
          <LibSidebar.Item href="#" icon={FaClipboardList}>
            Inventario
          </LibSidebar.Item>
          <LibSidebar.Item href="#" icon={FaLaptop}>
            Tipos de equipamiento
          </LibSidebar.Item>
          {isAdmin && (
            <>
              <LibSidebar.Item href="#" icon={FaBuilding}>
                Organizaciones
              </LibSidebar.Item>
            </>
          )}
        </LibSidebar.ItemGroup>
        <LibSidebar.ItemGroup>
          <LibSidebar.Item href="#" icon={FaDoorClosed}>
            <button onClick={signOut}>Cerrar sesión</button>
          </LibSidebar.Item>
        </LibSidebar.ItemGroup>
      </LibSidebar.Items>
    </LibSidebar>
  );
}
