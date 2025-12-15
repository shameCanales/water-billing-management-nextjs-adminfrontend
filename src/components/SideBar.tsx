"use client";
import SideBarLink from "@/components/ui/SideBarLink";
import { useLogout } from "@/hooks/useLogout";
import UserProfile from "./sections/UserProfile";
import Image from "next/image";
import { AppDispatch, RootState } from "@/lib/store/store";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "@/lib/store/uiSlice";

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
  const { mutate: logout, isPending } = useLogout();
  const sidebarIsOpen = useSelector(
    (state: RootState) => state.ui.mobileSidebarIsOpen
  );

  function handleCloseNav() {
    dispatch(uiActions.closeMobileSidebar());
  }

  return (
    <div
      className={` w-[250px] p-3 border-r-stone-300  bg-slate-50 ${
        sidebarIsOpen ? "absolute" : "hidden"
      }`}
    >
      <div className="flex items-center justify-between border-b-stone-900- border-b-2 py-2">
        <div className="flex items-center">
          <Image
            className=" bg-blue-700 p-2 rounded-md w-8"
            src={"/hand-holding-droplet.png"}
            alt="water billing icon"
            width="250"
            height="250"
          />
          <p className="font-semibold ml-2">Water Billing</p>
        </div>

        <button onClick={() => handleCloseNav()}>
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

      <ul className="grid gap-5 ">
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
        className="font-bold border-2 p-1 px-4 rounded-md"
        disabled={isPending}
        onClick={() => logout()}
      >
        Logout
      </button>
    </div>
  );
}
