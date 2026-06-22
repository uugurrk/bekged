import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import gallery6 from "@/assets/gallery-6.jpg";

export const site = {
  name: "BEKGED",
  fullName: "Bireysel Eğitim ve Kültürel Gelişim Derneği",
  tagline: "Empowering youth. Building bridges. Caring for our planet.",
  city: "Istanbul, Türkiye",
  email: "bekgeddernegi@gmail.com",
  oid: "E10330778",
  socials: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "Facebook", href: "https://facebook.com" },
    { label: "LinkedIn", href: "https://linkedin.com" },
    { label: "YouTube", href: "https://youtube.com" },
  ],
};

export const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/projects", label: "Projects" },
  { to: "/announcements", label: "Announcements" },
  { to: "/gallery", label: "Gallery" },
  { to: "/contact", label: "Contact" },
] as const;

export type Project = {
  slug: string;
  title: string;
  type: "Youth Exchange" | "Training Course" | "ESC" | "KA2";
  country: string;
  dates: string;
  deadline: string;
  participants: number;
  summary: string;
  topics: string[];
  status: "Open" | "Upcoming" | "Closed";
};

export const projects: Project[] = [
  {
    slug: "green-voices-2026",
    title: "Green Voices: Youth for Climate",
    type: "Youth Exchange",
    country: "Portugal, Lagos",
    dates: "12 – 21 April 2026",
    deadline: "28 February 2026",
    participants: 6,
    summary:
      "Ten days exploring how young people can lead the climate conversation through storytelling, podcasts and street campaigns.",
    topics: ["Climate", "Media literacy", "Activism"],
    status: "Open",
  },
  {
    slug: "include-me-in",
    title: "Include Me In",
    type: "Training Course",
    country: "Romania, Cluj-Napoca",
    dates: "3 – 10 June 2026",
    deadline: "15 March 2026",
    participants: 4,
    summary:
      "A training course for youth workers focused on practical tools for including disadvantaged young people in non-formal education.",
    topics: ["Inclusion", "Youth work", "Non-formal education"],
    status: "Open",
  },
  {
    slug: "bosphorus-bridges",
    title: "Bosphorus Bridges",
    type: "Youth Exchange",
    country: "Türkiye, Istanbul",
    dates: "9 – 17 September 2026",
    deadline: "10 July 2026",
    participants: 8,
    summary:
      "We host 40 young Europeans in Istanbul for a week of intercultural dialogue, city exploration and creative workshops.",
    topics: ["Intercultural learning", "Dialogue", "Culture"],
    status: "Upcoming",
  },
  {
    slug: "solidarity-istanbul",
    title: "Solidarity in Istanbul",
    type: "ESC",
    country: "Türkiye, Istanbul",
    dates: "12 months — rolling",
    deadline: "Rolling",
    participants: 2,
    summary:
      "Long-term European Solidarity Corps volunteering hosted by BEKGED, supporting youth and community work in Istanbul.",
    topics: ["Volunteering", "Community", "ESC"],
    status: "Open",
  },
  {
    slug: "digital-storytellers",
    title: "Digital Storytellers",
    type: "Training Course",
    country: "Spain, Granada",
    dates: "5 – 12 February 2026",
    deadline: "Closed",
    participants: 5,
    summary:
      "Eight days of mobile filmmaking and digital storytelling for youth workers running community media projects.",
    topics: ["Digital", "Media", "Storytelling"],
    status: "Closed",
  },
  {
    slug: "roots-and-routes",
    title: "Roots & Routes",
    type: "KA2",
    country: "Multi-country",
    dates: "2026 – 2027",
    deadline: "Partner search",
    participants: 0,
    summary:
      "Two-year cooperation partnership exploring rural youth migration, identity and belonging across four EU countries.",
    topics: ["Cooperation", "Research", "Rural youth"],
    status: "Upcoming",
  },
];

export type Announcement = {
  slug: string;
  title: string;
  date: string;
  tag: string;
  excerpt: string;
};

export const announcements: Announcement[] = [
  {
    slug: "call-green-voices",
    title: "Call for participants: Green Voices in Portugal",
    date: "2026-01-14",
    tag: "Call",
    excerpt:
      "We're sending 6 participants (18–30) to a 10-day youth exchange in Lagos. Travel, food and accommodation fully covered by Erasmus+.",
  },
  {
    slug: "winter-meetup",
    title: "BEKGED Winter Meetup — thank you!",
    date: "2025-12-20",
    tag: "Community",
    excerpt:
      "Over 80 alumni and curious newcomers joined us for a cozy evening in Kadıköy. Photos, hot tea and big plans for 2026.",
  },
  {
    slug: "esc-accreditation",
    title: "We are now ESC accredited",
    date: "2025-11-05",
    tag: "News",
    excerpt:
      "BEKGED received its European Solidarity Corps Quality Label as a host and supporting organisation. New volunteer calls coming soon.",
  },
  {
    slug: "climate-toolkit",
    title: "Free toolkit: Youth-led climate workshops",
    date: "2025-10-12",
    tag: "Resource",
    excerpt:
      "Download our 40-page toolkit with session plans, energizers and reflection methods for climate education with young people.",
  },
];

export const board = [
  {
    name: "Elif Demir",
    role: "Founder & President",
    bio: "Youth worker since 2014. Designs the long-term direction of BEKGED and represents the association internationally.",
  },
  {
    name: "Mehmet Kaya",
    role: "Vice President",
    bio: "Project manager for KA1 mobility. Loves a good logframe almost as much as a good simit.",
  },
  {
    name: "Zeynep Aydın",
    role: "Treasurer",
    bio: "Keeps the numbers honest. Specialises in Erasmus+ financial reporting and partner due diligence.",
  },
  {
    name: "Ahmet Yılmaz",
    role: "Inclusion Officer",
    bio: "Designs inclusion strategies and the support we offer to participants with fewer opportunities.",
  },
  {
    name: "Selin Öztürk",
    role: "Communications",
    bio: "Runs our calls, social media and the newsletter you'll wish you signed up for sooner.",
  },
  {
    name: "Burak Çelik",
    role: "Climate Lead",
    bio: "Leads our climate strand and the Green Voices project series.",
  },
];

export const gallery = [
  { src: gallery1, alt: "Youth volunteers planting a tree", span: "tall" },
  { src: gallery2, alt: "Workshop circle with sticky notes", span: "wide" },
  { src: gallery3, alt: "Intercultural evening with string lights", span: "normal" },
  { src: gallery4, alt: "Painting a community mural", span: "tall" },
  { src: gallery5, alt: "Group hike at sunset", span: "normal" },
  { src: gallery6, alt: "Hands holding a small globe with a sprout", span: "normal" },
];
