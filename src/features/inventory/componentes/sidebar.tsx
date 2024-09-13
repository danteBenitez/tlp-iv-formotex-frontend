import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import useAuth from "@/features/auth/hooks/use-auth";
import { Clipboard, DoorClosed } from "lucide-react";
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import BrandText from "./brand-text";

export default function Sidebar() {
  const { signOut } = useAuth();

  return (
    <div className="h-screen bg-white dark:bg-slate-900">
      <aside
        id="sidebar"
        className="static left-0 top-0 z-40 h-screen w-72 transition-transform"
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
  return (
    <NavigationMenu className="flex flex-col w-full justify-stretch min-w-full *:w-full">
      <NavigationMenuList className="w-full min-w-full flex items-stretch">
        <SidebarLink text="Inventario" icon={<Clipboard />} to="/inventory" />
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function SidebarLink(props: { to: string; icon: ReactNode; text: string }) {
  return (
    <NavigationMenuItem
      className={
        "flex items-center font-sans-accent gap-2 text-lg px-3 py-3 w-full"
      }
      asChild
    >
      <Link to={props.to} className={(navigationMenuTriggerStyle(), "w-full")}>
        <span className="flex-shrink-0 me-4">{props.icon}</span>
        <span className="text-nowrap text-xl">{props.text}</span>
      </Link>
    </NavigationMenuItem>
  );
}
