// Navigation configuration

export type NavLink = {
  label: string;
  description?: string;
  href: string;
  badge?: string;
  external?: boolean;
};

export type NavSection = {
  title: string;
  links: NavLink[];
};

export type NavCategory = {
  id: "market" | "news" | "platforms" | "learning" | "about";
  label: string;
  primaryHref: string;
  sections: NavSection[];
};

export const navConfig: NavCategory[] = [
  {
    id: "market",
    label: "Market & portfolio",
    primaryHref: "/prices",
    sections: [
      {
        title: "",
        links: [
          {
            label: "Prices",
            href: "/prices",
          },
          {
            label: "Assets",
            href: "/assets",
          },
          {
            label: "New Coins",
            href: "/new-coins",
          },
          {
            label: "Watchlist",
            href: "/watchlist",
          },
          {
            label: "Charts",
            href: "/charts",
          },
        ],
      },
    ],
  },
  {
    id: "news",
    label: "News",
    primaryHref: "/news",
    sections: [
      {
        title: "",
        links: [
          {
            label: "HK News",
            href: "/news",
          },
        ],
      },
    ],
  },
  {
    id: "platforms",
    label: "Platforms & opportunities",
    primaryHref: "/exchanges",
    sections: [
      {
        title: "",
        links: [
          {
            label: "Exchanges",
            href: "/exchanges",
          },
          {
            label: "Wallets",
            href: "/wallets",
          },
          {
            label: "Promotions & Airdrops",
            href: "/events",
          },
        ],
      },
    ],
  },
  {
    id: "learning",
    label: "Learning",
    primaryHref: "/guides",
    sections: [
      {
        title: "",
        links: [
          {
            label: "Crypto Basics",
            href: "/guides/crypto-basics",
          },
          {
            label: "Technical Indicators",
            href: "/guides/technical-indicators",
          },
          {
            label: "Candlestick Patterns",
            href: "/guides/candlestick-patterns",
          },
          {
            label: "Risk Management",
            href: "/guides/risk-management",
          },
          {
            label: "Most Viewed Guides",
            href: "/guides/popular",
          },
          {
            label: "Learning Paths",
            href: "/guides/paths",
          },
        ],
      },
    ],
  },
  {
    id: "about",
    label: "About",
    primaryHref: "/about",
    sections: [], // No dropdown menu for About
  },
];
