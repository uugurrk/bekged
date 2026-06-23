import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Project = {
  id: string;
  slug: string;
  title: string;
  type: string;
  country: string;
  dates: string;
  deadline: string;
  participants: number;
  summary: string;
  topics: string[];
  status: "Open" | "Upcoming" | "Closed";
  sort_order: number;
};

export type Announcement = {
  id: string;
  slug: string;
  title: string;
  date: string;
  tag: string;
  excerpt: string;
};

export type GalleryItem = {
  id: string;
  src: string;
  alt: string;
  span: string;
  sort_order: number;
};

export type AboutSection = {
  key: string;
  title: string;
  content: string;
};

export type Application = {
  id: string;
  project_slug: string;
  project_title: string;
  full_name: string;
  email: string;
  phone: string | null;
  birthdate: string | null;
  city: string | null;
  passport_type: string | null;
  passport_expiry: string | null;
  english_level: string | null;
  previous_projects: number | null;
  barriers: string[] | null;
  motivation: string;
  ngo_experience: string | null;
  follow_ig: boolean | null;
  follow_wa: boolean | null;
  consent_age: string | null;
  status: "pending" | "accepted" | "rejected";
  admin_notes: string | null;
  created_at: string;
};

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return (data ?? []) as Project[];
    },
  });
}

export function useAnnouncements() {
  return useQuery({
    queryKey: ["announcements"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .order("date", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Announcement[];
    },
  });
}

export function useGalleryItems() {
  return useQuery({
    queryKey: ["gallery"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gallery_items")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return (data ?? []) as GalleryItem[];
    },
  });
}

export function useAboutSections() {
  return useQuery({
    queryKey: ["about_sections"],
    queryFn: async () => {
      const { data, error } = await supabase.from("about_sections").select("*");
      if (error) throw error;
      return (data ?? []) as AboutSection[];
    },
  });
}
