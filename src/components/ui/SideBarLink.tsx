"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

interface SideBarLinkProps {
  route: string;
  label: string;
  icon: string;
}

export default function SideBarLink({ route, label, icon }: SideBarLinkProps) {
  const pathName = usePathname();
  const isActive = pathName === route;

  return (
    <Link href={route} className={`flex ${isActive ? "font-bold bg-blue-600 text-stone-50" : ""}`}>
      <Image src={`/${isActive ? "sidebarActive" : "sidebarInactive"}/${icon}`} alt="Logo" width={20} height={20} />
      {label}
    </Link>
  );
}
