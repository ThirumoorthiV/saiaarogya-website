import {
  BookOpen,
  Building2,
  CalendarClock,
  CircleHelp,
  ClipboardList,
  Globe,
  HandHeart,
  HeartHandshake,
  History,
  Images,
  Landmark,
  MapPin,
  Megaphone,
  MessageSquareQuote,
  Network,
  ShieldCheck,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";
import departmentsJson from "@/content/departments.json";

export interface NavLink {
  label: string;
  to: string;
  description?: string;
  icon?: LucideIcon;
  /** Department icon key (for the Departments menu) */
  deptIcon?: string;
}

export interface NavItem {
  label: string;
  /** Landing page for the section (also used for "active" highlighting) */
  to: string;
  /** Present → renders a dropdown */
  children?: NavLink[];
  /** Two-column dropdown */
  wide?: boolean;
}

const deptLinks: NavLink[] = (departmentsJson.items as { name: string; slug: string; icon: string; isActive: boolean; order: number }[])
  .filter((d) => d.isActive)
  .sort((a, b) => a.order - b.order)
  .map((d) => ({ label: d.name, to: `/departments/${d.slug}/`, deptIcon: d.icon }));

/** Main navigation — requirements §4.2, with dropdowns for sections that have sub-pages. */
export const MAIN_NAV: NavItem[] = [
  { label: "Home", to: "/" },
  {
    label: "About",
    to: "/about/",
    children: [
      { label: "Our story", to: "/about/", description: "Inspiration, founder, mission and the Trust", icon: Sparkles },
      { label: "History", to: "/about/history/", description: "From Aravinda Ashramam to Sai Aarogya", icon: History },
      { label: "Governance", to: "/about/governance/", description: "Trustees, advisors and management", icon: Landmark },
      { label: "Our network", to: "/about/#network", description: "SMSIMSR, Sanjeevani, Sai Swasthya", icon: Network },
    ],
  },
  { label: "Departments", to: "/departments/", wide: true, children: [{ label: "All departments", to: "/departments/", icon: Building2, description: "10 specialities, all free of charge" }, ...deptLinks] },
  { label: "Doctors", to: "/doctors/" },
  {
    label: "Patient Guide",
    to: "/patient-guide/",
    children: [
      { label: "OPD timings", to: "/patient-guide/opd-timings/", description: "Hours and who visits when", icon: CalendarClock },
      { label: "How to reach", to: "/patient-guide/how-to-reach/", description: "Map and directions to Khajipalem", icon: MapPin },
      { label: "Registration", to: "/patient-guide/registration/", description: "Three steps and what to bring", icon: ClipboardList },
      { label: "Facilities", to: "/patient-guide/facilities/", description: "Wards and services", icon: Building2 },
      { label: "FAQs", to: "/patient-guide/faqs/", description: "Is everything really free?", icon: CircleHelp },
    ],
  },
  {
    label: "Our Impact",
    to: "/impact/",
    children: [
      { label: "Impact at a glance", to: "/impact/", description: "The difference free care makes", icon: Sparkles },
      { label: "Patient stories", to: "/impact/stories/", description: "Shared with consent", icon: MessageSquareQuote },
      { label: "Camps & updates", to: "/impact/camps/", description: "Medical camps and news", icon: Megaphone },
      { label: "Gallery", to: "/impact/gallery/", description: "Photos of the hospital", icon: Images },
    ],
  },
  { label: "Contact", to: "/contact/" },
];

export const SUPPORT_LINKS: NavLink[] = [
  { label: "Donate", to: "/support-us/donate/", description: "Indian donors", icon: HeartHandshake },
  { label: "International donors", to: "/support-us/international-donors/", description: "Foreign nationals", icon: Globe },
  { label: "Volunteer", to: "/support-us/volunteer/", description: "Medical and non-medical", icon: HandHeart },
  { label: "Transparency", to: "/support-us/transparency/", description: "How funds are used", icon: ShieldCheck },
];

export const GUIDE_LINKS = MAIN_NAV.find((n) => n.label === "Patient Guide")!.children!;

export const FOOTER_EXTRA: NavLink[] = [
  { label: "Doctors", to: "/doctors/", icon: Users },
  { label: "Patient Guide", to: "/patient-guide/", icon: BookOpen },
];

/** Is `pathname` inside the section that starts at `to`? */
export const isActiveSection = (pathname: string, to: string) => (to === "/" ? pathname === "/" : pathname.startsWith(to.split("#")[0]!));
