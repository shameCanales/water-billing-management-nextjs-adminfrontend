"use client";
import SideBarLink from "@/components/ui/SideBarLink";
import { useLogout } from "@/hooks/auth/useLogout";
import UserProfile from "./sections/UserProfile";
import Image from "next/image";
import { AppDispatch, RootState } from "@/lib/store/store";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "@/lib/store/uiSlice";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

const links = [
  {
    route: "/dashboard",
    label: "Dashboard",
    iconName: "category.png",
  },
  {
    route: "/consumers",
    label: "Consumers",
    iconName: "users.png",
  },
  {
    route: "/connections",
    label: "Connections",
    iconName: "organization-chart.png",
  },
  {
    route: "/bills",
    label: "Bills",
    iconName: "file-invoice-dollar.png",
  },
  {
    route: "/incidents",
    label: "Incidents",
    iconName: "triangle-warning.png",
  },
  {
    route: "/announcements*",
    label: "Announcements",
    iconName: "bullhorn.png",
  },
  {
    route: "/reports",
    label: "Reports",
    iconName: "stats.png",
  },
  {
    route: "/processors",
    label: "Processors",
    iconName: "user-shield.png",
  },
  {
    route: "/settings",
    label: "Settings",
    iconName: "settings.png",
  },
];

export default function SideBar() {
  const dispatch = useDispatch<AppDispatch>();
  const { mutate: logout, isPending: loggingOut } = useLogout();

  const mobileSidebarIsOpen = useSelector(
    (state: RootState) => state.ui.mobileSidebarIsOpen
  );

  const sidebarIsExpanded = useSelector(
    (state: RootState) => state.ui.isSidebarExpanded
  );

  function handleCloseNav() {
    dispatch(uiActions.closeMobileSidebar());
  }

  function handleLogout() {
    dispatch(uiActions.closeMobileSidebar());
    logout();
  }

  function handleToggleExpandSidebar() {
    dispatch(uiActions.toggleExpandSidebar());
  }

  return (
    <div
      className={` ${
        sidebarIsExpanded ? "w-[250px]" : "w-auto"
      } p-4 h-full border-r-stone-300 bg-slate-50 z-50 ${
        mobileSidebarIsOpen ? "block" : "hidden"
      } xl:block`}
    >
      <button onClick={() => handleToggleExpandSidebar()}>
        {sidebarIsExpanded ? <PanelLeftClose /> : <PanelLeftOpen />}
      </button>

      <div
        className={`flex items-center ${
          sidebarIsExpanded ? "justify-between" : "justify-center"
        } mt-3`}
      >
        <div>
          <div className="flex items-center ">
            <Image
              className=" bg-blue-700 p-2 rounded-md w-8"
              src={"/hand-holding-droplet.png"}
              alt="water billing icon"
              width="250"
              height="250"
            />
            {sidebarIsExpanded && (
              <p className="font-semibold ml-4 ">Water Billing</p>
            )}
          </div>
        </div>

        <button className="xl:hidden" onClick={() => handleCloseNav()}>
          <Image
            className="w-8 "
            src="/cross-small.png"
            alt="close nav"
            width="500"
            height="500"
          />
        </button>
      </div>

      <UserProfile />

      <ul className="grid py-4">
        {links.map((link) => (
          <li key={link.route}>
            <SideBarLink
              route={link.route}
              label={link.label}
              icon={link.iconName}
            />
          </li>
        ))}
      </ul>

      <button
        className={`font-bold border-t border-slate-400 py-3 flex items-center ${
          sidebarIsExpanded ? "ml-2" : "justify-center "
        } w-full`}
        disabled={loggingOut}
        onClick={() => handleLogout()}
      >
        <Image
          className="w-4"
          src="/exit.png"
          alt="logout button"
          width={500}
          height={500}
        />
        {sidebarIsExpanded && <p className="text-red-700 ml-3">Logout</p>}
      </button>
    </div>
  );
}
