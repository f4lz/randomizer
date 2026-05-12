import { jsx as _jsx } from "react/jsx-runtime";
import { UtensilsCrossed, MapPin, Clapperboard, Target, Rocket, HelpCircle } from 'lucide-react';
const ICON_MAP = {
    UtensilsCrossed, MapPin, Clapperboard, Target, Rocket,
};
export default function CategoryIcon({ name, size = 28 }) {
    const Icon = ICON_MAP[name] ?? HelpCircle;
    return _jsx(Icon, { size: size });
}
