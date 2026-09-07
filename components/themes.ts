import type { Theme } from "./ThemeProvider";

export interface ThemeMeta {
  id: Theme;
  label: string;
  dot: string;
  description: string;
}

export const themes: ThemeMeta[] = [
  {
    id: "seventh-trumpet",
    label: "Seventh Trumpet",
    dot: "#9B6FD1",
    description: "Engraved Violet / Gothic Dark",
  },
  {
    id: "black-parade",
    label: "Black Parade",
    dot: "#E2DED0",
    description: "Vintage Bone / Obsidian",
  },
  {
    id: "californication",
    label: "Californication",
    dot: "#F97316",
    description: "Vivid Orange / Early 2000s Metal",
  },
];
