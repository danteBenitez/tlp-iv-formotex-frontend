import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import useAuth from "@/features/auth/hooks/use-auth";
import { Building, Clipboard, DoorClosed, Laptop, Users } from "lucide-react";
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import BrandText from "./brand-text";

export default function Sidebar() {
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <aside
        id="sidebar"
        className="fixed left-0 bottom-0 z-40 h-screen w-72 transition-transform"
        aria-label="Sidebar"
      >
        <div className="flex h-full flex-col overflow-y-auto border-r border-slate-200 bg-whit px-3 py-4 dark:border-slate-700 dark:bg-slate-900 w-full">
          <BrandText />
          <SidebarLinks />
          <div className="mt-auto flex">
            <Button onClick={signOut} className="">
              <DoorClosed />
            </Button>
          </div>
        </div>
      </aside>
    </div>
  );
}

function SidebarLinks() {
  const { isAdmin, isEmployee } = useAuth();
  return (
    <NavigationMenu className="flex flex-col w-full justify-stretch min-w-full *:w-full">
      <NavigationMenuList className="w-full min-w-full flex flex-col items-stretch">
        {isEmployee && (
          <>
            <SidebarLink
              text="Inventario"
              icon={<Clipboard />}
              to="/dashboard"
            />
            <SidebarLink
              text="Tipos de equipo"
              icon={<Laptop />}
              to="/dashboard/types"
            />
            <SidebarLink
              text="Marcas"
              icon={<Laptop />}
              to="/dashboard/makes"
            />
          </>
        )}
        {isAdmin && (
          <>
            <SidebarLink
              text="Usuarios"
              icon={<Users />}
              to="/dashboard/users"
            />
            <SidebarLink
              text="Organizaciones"
              icon={<Building />}
              to="/dashboard/organizations"
            />
          </>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function SidebarLink(props: { to: string; icon: ReactNode; text: string }) {
  return (
    <NavigationMenuItem
      className={"flex items-center font-sans-accent gap-2 px-3 py-3 w-full"}
      asChild
    >
      <Link to={props.to} className={(navigationMenuTriggerStyle(), "w-full")}>
        <span className="flex-shrink-0 me-4">{props.icon}</span>
        <span className="text-nowrap text-[1.2rem]">{props.text}</span>
      </Link>
    </NavigationMenuItem>
  );
}
