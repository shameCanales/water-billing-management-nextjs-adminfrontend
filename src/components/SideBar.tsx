"use client";
import SideBarLink from "@/components/ui/SideBarLink";
import { useLogout } from "@/hooks/auth/useLogout";
import UserProfile from "./sections/UserProfile";
import Image from "next/image";
import { AppDispatch, RootState } from "@/lib/store/store";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "@/lib/store/uiSlice";
import { PanelLeftClose, PanelLeftOpen, Droplets, LogOut } from "lucide-react";
import { useWindowWidth } from "@/hooks/useWindowWidth";
import { useEffect, useMemo } from "react";

const links = [
  // {
  //   route: "/dashboard",
  //   label: "Dashboard",
  //   iconName: "category.png",
  // },
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
  // {
  //   route: "/incidents",
  //   label: "Incidents",
  //   iconName: "triangle-warning.png",
  // },
  // {
  //   route: "/announcements*",
  //   label: "Announcements",
  //   iconName: "bullhorn.png",
  // },
  // {
  //   route: "/reports",
  //   label: "Reports",
  //   iconName: "stats.png",
  // },
  {
    route: "/staffs",
    label: "Staffs",
    iconName: "user-shield.png",
  },
  {
    route: "/settings",
    label: "Settings",
    iconName: "settings.png",
  },
];

const MANAGER_ONLY_ROUTES = ["/settings", "/staffs"];

export default function SideBar() {
  const dispatch = useDispatch<AppDispatch>();
  const { mutate: logout, isPending: loggingOut } = useLogout();
  const width = useWindowWidth();

  const mobileSidebarIsOpen = useSelector(
    (state: RootState) => state.ui.mobileSidebarIsOpen,
  );

  const sidebarIsExpanded = useSelector(
    (state: RootState) => state.ui.isSidebarExpanded,
  );

  const user = useSelector((state: RootState) => state.auth.user);
  const isManager = user?.role === "manager";

  const visibleLinks = useMemo(() => {
    return links.filter((link) => {
      // If the link is restricted...
      if (MANAGER_ONLY_ROUTES.includes(link.route)) {
        // ...only show it if the user is a manager
        return isManager;
      }
      // Otherwise, show it to everyone (Staff & Manager)
      return true;
    });
  }, [isManager]);

  useEffect(() => {
    if (width <= 1280 && !sidebarIsExpanded) {
      dispatch(uiActions.expandSidebar());
    }
  }, [width, sidebarIsExpanded, dispatch]);

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
        sidebarIsExpanded ? "w-[260px]" : "w-20"
      } h-full bg-linear-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] transition-all duration-300 z-50 flex flex-col ${
        mobileSidebarIsOpen ? "block absolute" : "hidden"
      } xl:block xl:static`}
    >
      {/* Collapse Toggle - Now styled like Figma */}
      <button
        className="hidden xl:flex items-center justify-center p-2 hover:bg-white/10 rounded-lg transition-colors m-4 mb-2"
        onClick={() => handleToggleExpandSidebar()}
      >
        <div className="text-gray-400">
          {sidebarIsExpanded ? (
            <PanelLeftClose size={18} />
          ) : (
            <PanelLeftOpen size={18} />
          )}
        </div>
        {sidebarIsExpanded && (
          <span className="ml-2 text-xs text-gray-400 uppercase tracking-widest font-semibold">
            Collapse
          </span>
        )}
      </button>

      {/* Logo Area */}
      <div
        className={`flex items-center gap-3 px-5 py-6 ${sidebarIsExpanded ? "" : "justify-center"}`}
      >
        <div className="w-10 h-10 bg-gradient-to-br from-[#3b82f6] via-[#2563eb] to-[#1d4ed8] rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 shrink-0">
          <Droplets className="w-5 h-5 text-white" />
        </div>
        {sidebarIsExpanded && (
          <span className="text-[16px] text-white font-semibold tracking-tight">
            WaterBill Pro
          </span>
        )}
      </div>

      <UserProfile />

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <ul className="space-y-1">
          {visibleLinks.map((link) => (
            <li key={link.route}>
              <SideBarLink
                route={link.route}
                label={link.label}
                icon={link.iconName}
              />
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="px-3 pb-6 border-t border-white/10 pt-4">
        <button
          className={`w-full flex items-center h-11 transition-all duration-200 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl ${
            sidebarIsExpanded ? "px-3.5" : "justify-center"
          }`}
          disabled={loggingOut}
          onClick={() => handleLogout()}
        >
          <LogOut
            className={`w-[18px] h-[18px] ${sidebarIsExpanded ? "mr-3" : ""}`}
          />
          {sidebarIsExpanded && (
            <span className="font-medium text-[13.5px]">Logout</span>
          )}
        </button>
      </div>
    </div>
  );
}
