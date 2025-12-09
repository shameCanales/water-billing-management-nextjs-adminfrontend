"use client";
import SideBarLink from "@/components/ui/SideBarLink";
import { useLogout } from "@/hooks/useLogout";

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
  const { mutate: logout, isPending } = useLogout();

  return (
    <div>
      <p>Navigation </p>
      <ul className="grid gap-5 bg-amber-300">
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
