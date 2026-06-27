"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-hairline/20 py-8 text-center">
        <p className="text-sm font-medium text-body/60">
          © {new Date().getFullYear()} Shie&apos;s Portfolio. All rights
          reserved.
        </p>
      </footer>
    </>
  );
}
