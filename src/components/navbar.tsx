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
      <HeroUINavbar
        maxWidth="xl"
        position="sticky"
        className="animate-fade-in-down"
      >
        <NavbarContent justify="start">
          {isToolPage && (
            <NavbarItem>
              <button
                type="button"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Toggle tools menu"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-foreground"
                >
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
            </NavbarItem>
          )}
          <NavbarBrand className="animate-slide-in-right">
            <RouterLink to="/" className="group">
              <p className="font-bold text-inherit transition-all duration-300 group-hover:scale-105 group-hover:text-primary">
                {siteConfig.name}
              </p>
            </RouterLink>
          </NavbarBrand>
          {siteConfig.navItems.length > 0 && (
            <div className="ml-4 hidden gap-4 sm:flex">
              {siteConfig.navItems.map((item, index) => (
                <NavbarItem
                  key={item.href}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${(index + 1) * 100}ms` }}
                >
                  <RouterLink
                    to={item.href}
                    className="group relative text-foreground transition-all duration-300 hover:scale-105 hover:text-primary"
                  >
                    {item.label}
                    <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full" />
                  </RouterLink>
                </NavbarItem>
              ))}
            </div>
          )}
        </NavbarContent>

        <NavbarContent justify="end">
          <NavbarItem className="animate-slide-in-left">
            <ThemeSwitch />
          </NavbarItem>
        </NavbarContent>
      </HeroUINavbar>

      {/* Sidebar - only show on tool pages */}
      {isToolPage && (
        <ToolsSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      )}
    </>
  );
};
