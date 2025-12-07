"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SideBarLinkProps {
  route: string;
  label: string;
}

export default function SideBarLink({ route, label }: SideBarLinkProps) {
  const pathName = usePathname();
  const isActive = pathName === route;

  return (
    <Link href={route} className={` ${isActive ? "font-bold" : ""}`}>
      {label}
    </Link>
  );
}
