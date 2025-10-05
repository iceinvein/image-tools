import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@heroui/navbar";
import { Link as RouterLink } from "@tanstack/react-router";
import { ThemeSwitch } from "@/components/theme-switch";
import { siteConfig } from "@/config/site";

export const Navbar = () => {
  return (
    <HeroUINavbar
      maxWidth="xl"
      position="sticky"
      className="animate-fade-in-down"
    >
      <NavbarContent justify="start">
        <NavbarBrand className="animate-slide-in-right">
          <RouterLink to="/" className="group">
            <p className="font-bold text-inherit transition-all duration-300 group-hover:scale-105 group-hover:text-primary">
              {siteConfig.name}
            </p>
          </RouterLink>
        </NavbarBrand>
        {siteConfig.navItems.length > 0 && (
          <div className="hidden sm:flex gap-4 ml-4">
            {siteConfig.navItems.map((item, index) => (
              <NavbarItem
                key={item.href}
                className="animate-fade-in-up"
                style={{ animationDelay: `${(index + 1) * 100}ms` }}
              >
                <RouterLink
                  to={item.href}
                  className="text-foreground hover:text-primary transition-all duration-300 hover:scale-105 relative group"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
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
  );
};
