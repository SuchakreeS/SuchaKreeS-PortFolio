import type { Theme } from "./ThemeProvider";

export interface ThemeMeta {
  id: Theme;
  label: string;
  dot: string;
  description: string;
  logo: string;
}

export const themes: ThemeMeta[] = [
  {
    id: "seventh-trumpet",
    label: "Seventh Trumpet",
    dot: "#9B6FD1",
    description: "Engraved Violet / Gothic Dark",
    logo: "/Resource/A7X2.svg",
  },
  {
    id: "black-parade",
    label: "Black Parade",
    dot: "#E2DED0",
    description: "Vintage Bone / Obsidian",
    logo: "/Resource/MCR2.svg",
  },
  {
    id: "californication",
    label: "Californication",
    dot: "#F97316",
    description: "Vivid Orange / Early 2000s Metal",
    logo: "/Resource/RHCP.svg",
  },
];
