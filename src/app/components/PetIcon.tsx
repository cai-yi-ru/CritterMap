import { getPetIconDefinition } from "@/lib/petIcons";
import Image from "next/image";

type PetIconProps = {
  pet: string;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  decorative?: boolean;
  className?: string;
};

const sizeClass = {
  sm: "h-6 w-6",
  md: "h-8 w-8",
  lg: "h-10 w-10",
};

export default function PetIcon({ pet, size = "md", showLabel = false, decorative = false, className = "" }: PetIconProps) {
  const icon = getPetIconDefinition(pet);

  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <Image
        src={icon.src}
        alt={showLabel || decorative ? "" : `${icon.label}圖示`}
        width={192}
        height={192}
        sizes={size === 'sm' ? '24px' : size === 'lg' ? '40px' : '32px'}
        className={`${sizeClass[size]} shrink-0 object-contain`}
        loading="lazy"
        decoding="async"
      />
      {showLabel && <span>{pet}</span>}
    </span>
  );
}
