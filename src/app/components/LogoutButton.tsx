"use client";

import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  function handleLogoutClick() {
    Cookies.remove("jwt-token");
    router.push("/login");
  }

  return (
    <button
      className="h-5 w-5 absolute right-4 bottom-4 bg-white p-1 rounded-full"
      onClick={handleLogoutClick}
    >
      <ArrowRightStartOnRectangleIcon />
    </button>
  );
}
