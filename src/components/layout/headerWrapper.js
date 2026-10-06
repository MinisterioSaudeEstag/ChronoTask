"use client";
import { usePathname } from "next/navigation";
import Header from "./header";

export default function HeaderWrapper() {
  const pathname = usePathname();

  if (pathname === "/") {
    return null;
  }

  if (pathname === "/login") {
    return null;
  }

  if (pathname === "/register") {
    return null;
  }

  return <Header />;
}