import { getPetIconDefinition } from "./petIcons";

/** Preserve every category in the summary; only limit the visible card preview. */
export function getHospitalPetPreview(pets: string[], selectedPet = "all") {
  const categories = Array.from(new Map(pets.map((pet) => {
    const definition = getPetIconDefinition(pet);
    return [definition.key, definition];
  })).values());
  const selectedKey = selectedPet === "all" ? null : getPetIconDefinition(selectedPet).key;
  const sorted = [...categories].sort((a, b) => {
    const priority = (pet: typeof a) => pet.key === selectedKey ? 0 : pet.isExotic ? 1 : 2;
    return priority(a) - priority(b);
  });
  return { visible: sorted.slice(0, 3), remaining: Math.max(0, sorted.length - 3), selectedKey };
}
