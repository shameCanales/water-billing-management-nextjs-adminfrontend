"use client";

import Image from "next/image";
import { AppDispatch } from "@/lib/store/store";
import { useDispatch } from "react-redux";
import { uiActions } from "@/lib/store/uiSlice";

export default function MenuButton() {
  const dispatch = useDispatch<AppDispatch>();

  function handleOpenNav() {
    dispatch(uiActions.openMobileSidebar());
  }

  return (
    <button
      className="xl:hidden border-slate-300 border-2 mb-5 p-2 rounded-md"
      onClick={() => handleOpenNav()}
    >
      <Image
        className="w-8 "
        src="/menu-burger.png"
        alt="open nav"
        width={200}
        height={200}
      />
    </button>
  );
}
