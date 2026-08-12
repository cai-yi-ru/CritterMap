import { getPetIconDefinition } from "@/lib/petIcons";
import Image from "next/image";

type PetIconProps = {
  pet: string;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
};

const sizeClass = {
  sm: "h-5 w-5",
  md: "h-7 w-7",
  lg: "h-10 w-10",
};

export default function PetIcon({ pet, size = "md", showLabel = false, className = "" }: PetIconProps) {
  const icon = getPetIconDefinition(pet);

  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <Image
        src={icon.src}
        alt={showLabel ? "" : `${icon.label}圖示`}
        width={192}
        height={192}
        className={`${sizeClass[size]} shrink-0 object-contain`}
        loading="lazy"
        decoding="async"
      />
      {showLabel && <span>{pet}</span>}
    </span>
  );
}
