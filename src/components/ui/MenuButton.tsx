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
    <button className="xl:hidden" onClick={() => handleOpenNav()}>
      <Image
        className="w-8 mb-5"
        src="/apps-add.png"
        alt="open nav"
        width={200}
        height={200}
      />
    </button>
  );
}
