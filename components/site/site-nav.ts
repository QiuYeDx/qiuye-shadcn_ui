export const siteNavItems = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Components",
    href: "/components",
  },
  {
    title: "CLI",
    href: "/cli",
  },
] as const;

export type SiteNavItem = (typeof siteNavItems)[number];
