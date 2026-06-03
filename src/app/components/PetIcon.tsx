import { getPetIconDefinition } from "@/lib/petIcons";

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
      <img
        src={icon.src}
        alt={`${icon.label} icon`}
        className={`${sizeClass[size]} shrink-0 rounded-full object-contain`}
        loading="lazy"
      />
      {showLabel && <span>{pet}</span>}
    </span>
  );
}
