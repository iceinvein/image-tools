export type NavItem = {
  label: string;
  href: string;
};

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Image Tools",
  description: "A collection of image processing tools",
  navItems: [] as NavItem[],
  navMenuItems: [
    {
      label: "Home",
      href: "/",
    },
  ],
  links: {
    github: "https://github.com/your-username/image-tools",
  },
};
