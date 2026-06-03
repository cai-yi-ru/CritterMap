export type PetIconKey =
  | "cat"
  | "dog"
  | "rabbit"
  | "mouse"
  | "guinea-pig"
  | "bird"
  | "reptile"
  | "lizard"
  | "snake"
  | "turtle"
  | "amphibian"
  | "frog"
  | "fish"
  | "hedgehog"
  | "sugar-glider"
  | "ferret"
  | "chinchilla"
  | "wild-animal"
  | "other-exotic";

export type PetIconDefinition = {
  key: PetIconKey;
  label: string;
  src: string;
  aliases: string[];
  filterable?: boolean;
  isExotic?: boolean;
};

export const petIconDefinitions: PetIconDefinition[] = [
  {
    key: "cat",
    label: "貓",
    src: "/pet-icons/cat.webp",
    aliases: ["貓"],
    filterable: true,
  },
  {
    key: "dog",
    label: "狗",
    src: "/pet-icons/dog.webp",
    aliases: ["狗", "犬"],
    filterable: true,
  },
  {
    key: "rabbit",
    label: "兔",
    src: "/pet-icons/rabbit.webp",
    aliases: ["兔", "兔子"],
    filterable: true,
    isExotic: true,
  },
  {
    key: "mouse",
    label: "鼠",
    src: "/pet-icons/mouse.webp",
    aliases: [
      "鼠",
      "鼠類",
      "倉鼠",
      "沙鼠",
      "黃金鼠",
      "寵物鼠",
      "小鼠",
      "大小白鼠",
      "嚙齒類",
      "其他齧齒類",
    ],
    filterable: true,
    isExotic: true,
  },
  {
    key: "guinea-pig",
    label: "天竺鼠",
    src: "/pet-icons/guinea-pig.webp",
    aliases: ["天竺鼠"],
    filterable: true,
    isExotic: true,
  },
  {
    key: "bird",
    label: "鳥類",
    src: "/pet-icons/bird.webp",
    aliases: ["鳥類", "鳥", "鳥禽", "鳥禽類", "禽鳥類", "禽類", "飛禽", "寵物鳥禽", "各種寵物鳥", "家禽", "賽鴿", "鴿子", "鸚鵡"],
    filterable: true,
    isExotic: true,
  },
  {
    key: "reptile",
    label: "爬蟲",
    src: "/pet-icons/reptile.webp",
    aliases: [
      "爬蟲",
      "爬蟲類",
      "爬蟲類（龜、角蛙、守宮、鬆獅蜥）",
    ],
    filterable: true,
    isExotic: true,
  },
  {
    key: "lizard",
    label: "守宮（蜥蜴）",
    src: "/pet-icons/lizard.webp",
    aliases: [
      "蜥蜴",
      "守宮",
      "鬆獅蜥",
      "變色龍",
    ],
    filterable: true,
    isExotic: true,
  },
  {
    key: "snake",
    label: "蛇",
    src: "/pet-icons/snake.webp",
    aliases: [
      "蛇",
      "各種蛇類",
    ],
    filterable: true,
    isExotic: true,
  },
  {
    key: "turtle",
    label: "烏龜",
    src: "/pet-icons/turtle.webp",
    aliases: [
      "烏龜",
      "龜",
      "水龜",
      "澤龜",
      "箱龜",
      "陸龜",
    ],
    filterable: true,
    isExotic: true,
  },
  {
    key: "amphibian",
    label: "兩棲",
    src: "/pet-icons/amphibian.webp",
    aliases: ["兩棲", "兩棲類", "蠑螈", "六角恐龍"],
    filterable: true,
    isExotic: true,
  },
  {
    key: "frog",
    label: "蛙",
    src: "/pet-icons/frog.webp",
    aliases: ["蛙", "蛙類", "青蛙", "角蛙"],
    filterable: true,
    isExotic: true,
  },
  {
    key: "fish",
    label: "魚",
    src: "/pet-icons/fish.webp",
    aliases: ["魚", "魚類", "水生動物"],
    filterable: true,
    isExotic: true,
  },
  {
    key: "hedgehog",
    label: "刺蝟",
    src: "/pet-icons/hedgehog.webp",
    aliases: ["刺蝟"],
    filterable: true,
    isExotic: true,
  },
  {
    key: "sugar-glider",
    label: "蜜袋鼯",
    src: "/pet-icons/sugar-glider.webp",
    aliases: ["蜜袋鼯", "飛鼠"],
    filterable: true,
    isExotic: true,
  },
  {
    key: "ferret",
    label: "貂",
    src: "/pet-icons/ferret.webp",
    aliases: ["貂", "雪貂"],
    filterable: true,
    isExotic: true,
  },
  {
    key: "chinchilla",
    label: "龍貓",
    src: "/pet-icons/chinchilla.webp",
    aliases: ["龍貓"],
    filterable: true,
    isExotic: true,
  },
  {
    key: "wild-animal",
    label: "野生動物",
    src: "/pet-icons/wild-animal.webp",
    aliases: [
      "野生動物",
      "浣熊",
      "狐獴",
      "猴",
      "非人靈長類",
      "松鼠",
      "水豚",
      "土撥鼠",
      "羊",
      "豬",
      "迷你豬",
      "馬",
      "迷你馬",
      "蝦",
    ],
    filterable: true,
    isExotic: true,
  },
  {
    key: "other-exotic",
    label: "其他特寵",
    src: "/pet-icons/other-exotic.webp",
    aliases: [
      "其他特寵",
      "其他",
      "其他動物",
      "哺乳類",
      "小型哺乳類",
      "特殊動物",
      "特殊寵物",
      "非犬貓寵物",
      "非犬貓特殊寵物",
      "非犬貓（未具體說明）",
    ],
    filterable: true,
    isExotic: true,
  },
];

export const petCategoryFilterOptions = petIconDefinitions.filter((definition) => definition.filterable);

export function getPetIconDefinition(petName: string) {
  return petIconDefinitions.find((definition) => definition.aliases.includes(petName))
    || petIconDefinitions.find((definition) => definition.key === "other-exotic")!;
}

export function getCanonicalPetCategory(value: string) {
  return getPetIconDefinition(value).label;
}

export function isDogOrCatCategory(value: string) {
  return getCanonicalPetCategory(value) === "狗" || getCanonicalPetCategory(value) === "貓";
}

export function isExoticPetCategory(value: string) {
  return getPetIconDefinition(value).isExotic === true;
}
