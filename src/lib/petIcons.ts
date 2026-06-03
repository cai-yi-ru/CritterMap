export type PetIconKey =
  | "cat"
  | "dog"
  | "rabbit"
  | "mouse"
  | "guinea-pig"
  | "bird"
  | "reptile"
  | "hedgehog"
  | "sugar-glider"
  | "other-exotic";

export type PetIconDefinition = {
  key: PetIconKey;
  label: string;
  src: string;
  aliases: string[];
};

export const petIconDefinitions: PetIconDefinition[] = [
  {
    key: "cat",
    label: "貓",
    src: "/pet-icons/cat.webp",
    aliases: ["貓"],
  },
  {
    key: "dog",
    label: "狗",
    src: "/pet-icons/dog.webp",
    aliases: ["狗", "犬"],
  },
  {
    key: "rabbit",
    label: "兔",
    src: "/pet-icons/rabbit.webp",
    aliases: ["兔", "兔子"],
  },
  {
    key: "mouse",
    label: "鼠",
    src: "/pet-icons/mouse.webp",
    aliases: ["鼠", "鼠類", "倉鼠", "沙鼠"],
  },
  {
    key: "guinea-pig",
    label: "天竺鼠",
    src: "/pet-icons/guinea-pig.webp",
    aliases: ["天竺鼠"],
  },
  {
    key: "bird",
    label: "鳥類",
    src: "/pet-icons/bird.webp",
    aliases: ["鳥類", "鳥"],
  },
  {
    key: "reptile",
    label: "爬蟲",
    src: "/pet-icons/reptile.webp",
    aliases: ["爬蟲", "爬蟲類", "烏龜", "龜"],
  },
  {
    key: "hedgehog",
    label: "刺蝟",
    src: "/pet-icons/hedgehog.webp",
    aliases: ["刺蝟"],
  },
  {
    key: "sugar-glider",
    label: "蜜袋鼯",
    src: "/pet-icons/sugar-glider.webp",
    aliases: ["蜜袋鼯"],
  },
  {
    key: "other-exotic",
    label: "其他特寵",
    src: "/pet-icons/other-exotic.webp",
    aliases: ["其他特寵", "龍貓", "其他"],
  },
];

export function getPetIconDefinition(petName: string) {
  return petIconDefinitions.find((definition) => definition.aliases.includes(petName))
    || petIconDefinitions.find((definition) => definition.key === "other-exotic")!;
}
