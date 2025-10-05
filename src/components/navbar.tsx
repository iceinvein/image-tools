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
    <HeroUINavbar maxWidth="xl" position="sticky">
      <NavbarContent justify="start">
        <NavbarBrand>
          <RouterLink to="/">
            <p className="font-bold text-inherit">{siteConfig.name}</p>
          </RouterLink>
        </NavbarBrand>
        {siteConfig.navItems.length > 0 && (
          <div className="hidden sm:flex gap-4 ml-4">
            {siteConfig.navItems.map((item) => (
              <NavbarItem key={item.href}>
                <RouterLink
                  to={item.href}
                  className="text-foreground hover:text-primary transition-colors"
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
  );
};
