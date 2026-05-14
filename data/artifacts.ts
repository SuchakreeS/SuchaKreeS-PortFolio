export interface Artifact {
  id: string;
  title: string;
  category: "Photography" | "Design" | "Architecture";
  imageUrl: string;
  metadata: {
    iso: string;
    aperture: string;
    shutter: string;
  };
  span: "small" | "medium" | "large" | "tall";
}

export const artifacts: Artifact[] = [
  {
    id: "1",
    title: "Samll Lights",
    category: "Photography",
    imageUrl: "https://res.cloudinary.com/psac/image/upload/v1778725452/IMG_9719_ahxxlq.jpg",
    metadata: { iso: "100", aperture: "f/5.6", shutter: "1/500s" },
    span: "large",
  },
  {
    id: "2",
    title: "On the Mountain",
    category: "Photography",
    imageUrl: "https://res.cloudinary.com/psac/image/upload/v1778725454/IMG_9759_qrd3kg.jpg",
    metadata: { iso: "100", aperture: "f/5.0", shutter: "1/320s" },
    span: "small",
  },
  {
    id: "3",
    title: "Cyberpunk Alley",
    category: "Photography",
    imageUrl: "https://res.cloudinary.com/psac/image/upload/v1778725442/_MG_9448_ogrmol.jpg",
    metadata: { iso: "100", aperture: "f/4", shutter: "1/4000s" },
    span: "medium",
  },
  {
    id: "4",
    title: "On the Throne",
    category: "Photography",
    imageUrl: "https://res.cloudinary.com/psac/image/upload/v1778725441/IMG_9921_cmfygh.jpg",
    metadata: { iso: "100", aperture: "f/5.6", shutter: "1/320s" },
    span: "tall",
  },
  {
    id: "5",
    title: "Industrial Decay",
    category: "Photography",
    imageUrl: "https://res.cloudinary.com/psac/image/upload/v1778725442/IMG_0650_vymlz8.jpg",
    metadata: { iso: "800", aperture: "f/4.0", shutter: "1/100s" },
    span: "medium",
  },
  {
    id: "6",
    title: "Raining Day",
    category: "Photography",
    imageUrl: "https://res.cloudinary.com/psac/image/upload/v1778725442/IMG_0779_y7qqbl.jpg",
    metadata: { iso: "100", aperture: "f/5.0", shutter: "1/500s" },
    span: "small",
  },
  {
    id: "7",
    title: "Morning Sky",
    category: "Photography",
    imageUrl: "https://res.cloudinary.com/psac/image/upload/v1778725441/IMG_0703_zcsvkr.jpg",
    metadata: { iso: "100", aperture: "f/5.6", shutter: "1/800s" },
    span: "medium",
  },
  {
    id: "8",
    title: "Lonely Brideg",
    category: "Photography",
    imageUrl: "https://res.cloudinary.com/psac/image/upload/v1778725443/_MG_9336_dvxey5.jpg",
    metadata: { iso: "100", aperture: "f/4.0", shutter: "1/1600s" },
    span: "large",
  },
];
