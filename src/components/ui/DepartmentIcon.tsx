import {
  Baby,
  Bone,
  Droplets,
  Eye,
  Hand,
  HeartHandshake,
  HeartPulse,
  Scissors,
  Smile,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";

/** Maps the CMS `icon` field to a Lucide icon. */
const icons: Record<string, LucideIcon> = {
  stethoscope: Stethoscope,
  scissors: Scissors,
  smile: Smile,
  bone: Bone,
  baby: Baby,
  eye: Eye,
  "heart-handshake": HeartHandshake,
  "heart-pulse": HeartPulse,
  hand: Hand,
  droplets: Droplets,
};

export const departmentIconNames = Object.keys(icons);

export function DepartmentIcon({ name, className = "h-6 w-6" }: { name: string; className?: string }) {
  const Icon = icons[name] ?? Stethoscope;
  return <Icon className={className} aria-hidden />;
}
