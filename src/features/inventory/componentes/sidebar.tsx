import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Switch } from "@/components/ui/switch";
import useAuth from "@/features/auth/hooks/use-auth";
import { useTheme } from "@/features/common/hooks/use-theme";
import {
  Building,
  Building2,
  Clipboard,
  DoorClosed,
  Laptop,
  Moon,
  Pen,
  Sun,
  Users,
} from "lucide-react";
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import BrandText from "./brand-text";

export default function Sidebar() {
  const { signOut, user } = useAuth();
  const { theme, toggle } = useTheme();

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
          <div className="flex justify-between">
            <div className="flex gap-2 items-center py-5 p-2">
              <Avatar>
                <AvatarFallback>
                  {user?.username[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span>{user?.username}</span>
            </div>
            <div className="flex gap-4 items-center">
              {theme == "light" ? <Sun /> : <Moon />}
              <Switch checked={theme == "dark"} onCheckedChange={toggle} />
            </div>
          </div>
          <div className="mt-auto flex flex-col gap-2 w-full">
            <Button
              onClick={signOut}
              variant="secondary"
              className="w-full flex justify-center gap-2 p-4"
            >
              <DoorClosed />
              <span>Cerrar sesión</span>
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
              icon={<Building2 />}
              to="/dashboard/makes"
            />
            <SidebarLink
              text="Actividad"
              icon={<Pen />}
              to="/dashboard/activities"
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
