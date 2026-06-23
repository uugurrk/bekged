import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import gallery6 from "@/assets/gallery-6.jpg";

export const site = {
  name: "BEKGED",
  fullName: "Boğaziçi Education Culture and Development Association",
  tagline: "Empowering youth. Building bridges. Caring for our planet.",
  city: "Istanbul, Türkiye",
  email: "bekgeddernegi@gmail.com",
  oid: "E10330778",
  socials: [
    { label: "Instagram", href: "https://www.instagram.com/bekgedernegi/" },
    { label: "WhatsApp", href: "https://whatsapp.com/channel/0029VaGOdZJ35fLqypFjCY3V" },
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
  type: "Youth Exchange" | "Training Course" | "KA2";
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
    slug: "sound-lab-cultural-remix",
    title: "Sound Lab: Cultural Remix Project",
    type: "Youth Exchange",
    country: "Osterholz-Scharmbeck, Germany",
    dates: "6 – 14 February 2026",
    deadline: "Rolling",
    participants: 5,
    summary:
      "An intercultural youth exchange bringing together participants from Germany, Türkiye, Greece, Serbia, and North Macedonia. Through music, creativity, and collaborative artistic production, participants strengthen cultural understanding, teamwork, and self-expression.",
    topics: ["Music", "Intercultural", "Creativity"],
    status: "Open",
  },
  {
    slug: "democratic-youth-work",
    title: "Democratic Youth Work in the Green and Digital Era",
    type: "Training Course",
    country: "Strumica, North Macedonia",
    dates: "20 – 27 April 2026",
    deadline: "Rolling",
    participants: 3,
    summary:
      "A youth worker mobility project focused on democratic participation, digital youth work, sustainability, active citizenship, and innovative approaches to engaging young people in the green and digital transition.",
    topics: ["Democracy", "Digital", "Sustainability"],
    status: "Open",
  },
  {
    slug: "team-building-bulgaria",
    title: "Team Building",
    type: "Youth Exchange",
    country: "Banya Village, Bulgaria",
    dates: "18 – 26 May 2026",
    deadline: "Rolling",
    participants: 5,
    summary:
      "A project designed to develop leadership, teamwork, communication, intercultural dialogue, and problem-solving skills through non-formal education activities and outdoor learning experiences.",
    topics: ["Leadership", "Teamwork", "Outdoor"],
    status: "Open",
  },
  {
    slug: "creating-possibilities-from-scratch",
    title: "Creating Possibilities – From Scratch",
    type: "Youth Exchange",
    country: "Cristuru Secuiesc, Romania",
    dates: "21 – 28 May 2026",
    deadline: "Rolling",
    participants: 5,
    summary:
      "A youth exchange supporting creativity, entrepreneurship, initiative-taking, and personal development while encouraging young people to transform ideas into practical opportunities.",
    topics: ["Entrepreneurship", "Creativity", "Personal development"],
    status: "Open",
  },
  {
    slug: "bite-into-change",
    title: "BITE INTO CHANGE – Fighting Food Waste & Overconsumption",
    type: "Youth Exchange",
    country: "Rettenegg, Austria",
    dates: "19 – 27 June 2026",
    deadline: "Rolling",
    participants: 5,
    summary:
      "A sustainability-focused youth exchange addressing food waste, overconsumption, climate action, and responsible lifestyles. Participants explore practical solutions for reducing waste and promoting sustainable habits.",
    topics: ["Sustainability", "Climate", "Food waste"],
    status: "Open",
  },
  {
    slug: "debate-today-lead-tomorrow",
    title: "Debate Today – Lead Tomorrow",
    type: "Training Course",
    country: "Kruševo, North Macedonia",
    dates: "18 – 25 July 2026",
    deadline: "Rolling",
    participants: 3,
    summary:
      "A youth worker training course focusing on critical thinking, debate methodologies, democratic participation, media literacy, communication skills, and combating misinformation.",
    topics: ["Debate", "Media literacy", "Democracy"],
    status: "Upcoming",
  },
  {
    slug: "the-dopamine-quest",
    title: "The Dopamine Quest",
    type: "Youth Exchange",
    country: "Cristuru Secuiesc, Romania",
    dates: "22 – 31 August 2026",
    deadline: "Rolling",
    participants: 5,
    summary:
      "A project dedicated to mental health and well-being, exploring healthy habits, emotional resilience, digital balance, self-awareness, happiness, and positive social relationships.",
    topics: ["Mental health", "Well-being", "Digital balance"],
    status: "Upcoming",
  },
  {
    slug: "green-box-slavic-myths",
    title: "Green Box: Slavic Myths on Screen",
    type: "Youth Exchange",
    country: "Krakow, Poland",
    dates: "21 – 29 August 2026",
    deadline: "Rolling",
    participants: 5,
    summary:
      "An innovative media and culture project where participants explore Slavic mythology, cultural heritage, digital storytelling, and filmmaking while creating creative media products in international teams.",
    topics: ["Filmmaking", "Culture", "Storytelling"],
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
    slug: "call-sound-lab",
    title: "Call for participants: Sound Lab in Germany",
    date: "2026-01-10",
    tag: "Call",
    excerpt:
      "We are sending participants (18–30) to a youth exchange in Osterholz-Scharmbeck. Travel, food and accommodation fully covered by Erasmus+.",
  },
  {
    slug: "winter-meetup",
    title: "BEKGED Winter Meetup — thank you!",
    date: "2025-12-20",
    tag: "Community",
    excerpt:
      "Alumni and curious newcomers joined us for a cozy evening in Kadıköy. Photos, hot tea and big plans for 2026.",
  },
  {
    slug: "info-workshops",
    title: "Erasmus+ info workshops at youth centers",
    date: "2025-11-15",
    tag: "News",
    excerpt:
      "We are running free Erasmus+ information workshops at youth centers and schools across Istanbul, with online Q&A sessions for participants outside the city.",
  },
  {
    slug: "climate-toolkit",
    title: "Free toolkit: Youth-led climate workshops",
    date: "2025-10-12",
    tag: "Resource",
    excerpt:
      "Download our toolkit with session plans, energizers and reflection methods for climate education with young people.",
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
    bio: "Leads our climate strand and sustainability-focused project series.",
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
