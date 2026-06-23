import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import gallery6 from "@/assets/gallery-6.jpg";
import logoAsset from "@/assets/bekged-logo.png.asset.json";

export const site = {
  name: "BEKGED",
  fullName: "Bosphorus Education Culture and Development Association",
  tagline: "Empowering youth. Building bridges. Caring for our planet.",
  city: "Istanbul, Türkiye",
  email: "bekgeddernegi@gmail.com",
  oid: "E10330778",
  logo: logoAsset.url,
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

export const board = [
  { name: "Elif Demir", role: "Founder & President", bio: "Youth worker since 2014. Designs the long-term direction of BEKGED and represents the association internationally." },
  { name: "Mehmet Kaya", role: "Vice President", bio: "Project manager for KA1 mobility. Loves a good logframe almost as much as a good simit." },
  { name: "Zeynep Aydın", role: "Treasurer", bio: "Keeps the numbers honest. Specialises in Erasmus+ financial reporting and partner due diligence." },
  { name: "Ahmet Yılmaz", role: "Inclusion Officer", bio: "Designs inclusion strategies and the support we offer to participants with fewer opportunities." },
  { name: "Selin Öztürk", role: "Communications", bio: "Runs our calls, social media and the newsletter you'll wish you signed up for sooner." },
  { name: "Burak Çelik", role: "Climate Lead", bio: "Leads our climate strand and sustainability-focused project series." },
];

// Fallback gallery images bundled with the site (used when the admin
// hasn't added any photos yet).
export const fallbackGallery = [
  { src: gallery1, alt: "Youth volunteers planting a tree" },
  { src: gallery2, alt: "Workshop circle with sticky notes" },
  { src: gallery3, alt: "Intercultural evening with string lights" },
  { src: gallery4, alt: "Painting a community mural" },
  { src: gallery5, alt: "Group hike at sunset" },
  { src: gallery6, alt: "Hands holding a small globe with a sprout" },
];
