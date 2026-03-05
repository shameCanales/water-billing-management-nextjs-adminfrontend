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
    (state: RootState) => state.ui.isSidebarExpanded,
  );

  return (
    <Link
      href={route}
      className={`w-full flex items-center ${
        sidebarIsExpanded ? "gap-3 px-3.5" : "justify-center px-2"
      } py-3 rounded-xl transition-all duration-200 text-[13.5px] relative overflow-hidden group ${
        isActive
          ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30"
          : "text-gray-300 hover:bg-white/5 hover:text-white"
      }`}
    >
      {/* Active Glow Effect */}
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-transparent" />
      )}

      <Image
        className={`relative z-10 h-[18px] w-[18px] brightness-0 invert transition-all ${
          isActive ? "opacity-100" : "opacity-40 group-hover:opacity-100"
        }`}
        src={`/${isActive ? "sidebarActive" : "sidebarInactive"}/${icon}`}
        alt={label}
        width={18}
        height={18}
      />

      {sidebarIsExpanded && (
        <span className="font-medium relative z-10">{label}</span>
      )}
    </Link>
  );
}

// export default function SideBarLink({ route, label, icon }: SideBarLinkProps) {
//   const pathName = usePathname();
//   const isActive = pathName === route;
//   const sidebarIsExpanded = useSelector(
//     (state: RootState) => state.ui.isSidebarExpanded
//   );

//   return (
//     <Link
//       href={route}
//       className={`flex items-center ${
//         sidebarIsExpanded ? "" : "justify-center"
//       } rounded-md p-2 ${
//         isActive ? "font-semibold bg-indigo-600 text-stone-50" : ""
//       }`}
//     >
//       <Image
//         className="h-4 w-4 aspect-square "
//         src={`/${isActive ? "sidebarActive" : "sidebarInactive"}/${icon}`}
//         alt="Logo"
//         width={20}
//         height={20}
//       />
//       {sidebarIsExpanded && <p className="ml-3 text-sm">{label}</p>}
//     </Link>
//   );
// }
