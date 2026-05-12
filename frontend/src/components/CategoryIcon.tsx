import { UtensilsCrossed, MapPin, Clapperboard, Target, Rocket, HelpCircle, type LucideIcon } from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  UtensilsCrossed, MapPin, Clapperboard, Target, Rocket,
};

export default function CategoryIcon({ name, size = 28 }: { name: string; size?: number }) {
  const Icon = ICON_MAP[name] ?? HelpCircle;
  return <Icon size={size} />;
}
