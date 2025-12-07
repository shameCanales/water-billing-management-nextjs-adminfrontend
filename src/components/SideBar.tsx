"use client";

import SideBarLink from "@/components/ui/SideBarLink";
import { useLogout } from "@/hooks/useLogout";

const links = [
  {
    route: "/dashboard",
    label: "Dashboard",
  },
  {
    route: "/consumers",
    label: "Consumers",
  },
  {
    route: "/connections",
    label: "Connections",
  },
  {
    route: "/bills",
    label: "Bills",
  },
  {
    route: "/settings",
    label: "Settings",
  },
];

export default function SideBar() {
  const { mutate: logout, isPending } = useLogout();

  return (
    <div>
      <p>Navigation </p>
      <ul>
        {links.map((link) => (
          <li key={link.route}>
            <SideBarLink route={link.route} label={link.label} />
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
