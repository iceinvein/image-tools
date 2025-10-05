export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Image Tools",
  description: "A collection of image processing tools",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Tools",
      href: "/tools",
    },
    {
      label: "Converter",
      href: "/tools/converter",
    },
    {
      label: "Resizer",
      href: "/tools/resizer",
    },
    {
      label: "Editor",
      href: "/tools/editor",
    },
    {
      label: "About",
      href: "/about",
    },
  ],
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
