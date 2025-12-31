"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";

interface SideBarLinkProps {
  route: string;
  label: string;
  icon: string;
}

export default function SideBarLink({ route, label, icon }: SideBarLinkProps) {
  const pathName = usePathname();
  const isActive = pathName === route;
  const sidebarIsExpanded = useSelector(
    (state: RootState) => state.ui.isSidebarExpanded
  );

  return (
    <Link
      href={route}
      className={`flex items-center ${
        sidebarIsExpanded ? "" : "justify-center"
      } rounded-md p-2 ${
        isActive ? "font-semibold bg-indigo-600 text-stone-50" : ""
      }`}
    >
      <Image
        className="h-4 w-4 aspect-square "
        src={`/${isActive ? "sidebarActive" : "sidebarInactive"}/${icon}`}
        alt="Logo"
        width={20}
        height={20}
      />
      {sidebarIsExpanded && <p className="ml-3 text-sm">{label}</p>}
    </Link>
  );
}
