import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@heroui/navbar";
import { Link as RouterLink, useLocation } from "@tanstack/react-router";
import { useState } from "react";
import { ThemeSwitch } from "@/components/theme-switch";
import { ToolsSidebar } from "@/components/tools-sidebar";
import { siteConfig } from "@/config/site";

export const Navbar = () => {
  const location = useLocation();
  const isToolPage = location.pathname.includes("/tools/");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <HeroUINavbar maxWidth="lg" position="sticky">
        <NavbarContent justify="start">
          {isToolPage && (
            <NavbarItem>
              <button
                type="button"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                aria-label="Toggle tools menu"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
            </NavbarItem>
          )}
          <NavbarBrand>
            <RouterLink to="/" className="flex items-center gap-2">
              <div className="h-5 w-5 rounded bg-primary" />
              <span className="font-bold text-lg text-zinc-900 tracking-tight dark:text-zinc-100">
                {siteConfig.name}
              </span>
            </RouterLink>
          </NavbarBrand>
          {siteConfig.navItems.length > 0 && (
            <div className="ml-4 hidden gap-4 sm:flex">
              {siteConfig.navItems.map((item) => (
                <NavbarItem key={item.href}>
                  <RouterLink
                    to={item.href}
                    className="text-sm text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                  >
                    {item.label}
                  </RouterLink>
                </NavbarItem>
              ))}
            </div>
          )}
        </NavbarContent>

        <NavbarContent justify="end">
          <NavbarItem>
            <ThemeSwitch />
          </NavbarItem>
        </NavbarContent>
      </HeroUINavbar>

      {isToolPage && (
        <ToolsSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      )}
    </>
  );
};
