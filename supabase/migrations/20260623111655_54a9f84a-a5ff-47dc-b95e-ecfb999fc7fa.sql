
-- Roles
CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- Claim admin: first signed-in user (when no admin exists) becomes admin
CREATE OR REPLACE FUNCTION public.claim_admin()
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE uid uuid;
BEGIN
  uid := auth.uid();
  IF uid IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    RETURN false;
  END IF;
  INSERT INTO public.user_roles (user_id, role) VALUES (uid, 'admin') ON CONFLICT DO NOTHING;
  RETURN true;
END;
$$;

-- updated_at helper
CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

-- Projects
CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  type text NOT NULL,
  country text NOT NULL,
  dates text NOT NULL,
  deadline text NOT NULL DEFAULT 'Rolling',
  participants int NOT NULL DEFAULT 5,
  summary text NOT NULL,
  topics text[] NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'Open',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.projects TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT ALL ON public.projects TO service_role;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "admin write projects" ON public.projects FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_projects_updated BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Announcements
CREATE TABLE public.announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  date date NOT NULL DEFAULT current_date,
  tag text NOT NULL DEFAULT 'News',
  excerpt text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.announcements TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.announcements TO authenticated;
GRANT ALL ON public.announcements TO service_role;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read ann" ON public.announcements FOR SELECT USING (true);
CREATE POLICY "admin write ann" ON public.announcements FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_ann_updated BEFORE UPDATE ON public.announcements FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Gallery
CREATE TABLE public.gallery_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  src text NOT NULL,
  alt text NOT NULL DEFAULT '',
  span text NOT NULL DEFAULT 'normal',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.gallery_items TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.gallery_items TO authenticated;
GRANT ALL ON public.gallery_items TO service_role;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read gallery" ON public.gallery_items FOR SELECT USING (true);
CREATE POLICY "admin write gallery" ON public.gallery_items FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- About sections (key-value)
CREATE TABLE public.about_sections (
  key text PRIMARY KEY,
  title text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.about_sections TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.about_sections TO authenticated;
GRANT ALL ON public.about_sections TO service_role;
ALTER TABLE public.about_sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read about" ON public.about_sections FOR SELECT USING (true);
CREATE POLICY "admin write about" ON public.about_sections FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_about_updated BEFORE UPDATE ON public.about_sections FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Applications
CREATE TABLE public.applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_slug text NOT NULL,
  project_title text NOT NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  birthdate date,
  city text,
  passport_type text,
  passport_expiry date,
  english_level text,
  previous_projects int,
  barriers text[] DEFAULT '{}',
  motivation text NOT NULL,
  ngo_experience text,
  follow_ig boolean DEFAULT false,
  follow_wa boolean DEFAULT false,
  consent_age text,
  status text NOT NULL DEFAULT 'pending',
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.applications TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.applications TO authenticated;
GRANT ALL ON public.applications TO service_role;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone submits" ON public.applications FOR INSERT WITH CHECK (true);
CREATE POLICY "admin read app" ON public.applications FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin update app" ON public.applications FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin delete app" ON public.applications FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(),'admin'));

-- Seed projects
INSERT INTO public.projects (slug,title,type,country,dates,deadline,participants,summary,topics,status,sort_order) VALUES
('sound-lab-cultural-remix','Sound Lab: Cultural Remix Project','Youth Exchange','Osterholz-Scharmbeck, Germany','6 – 14 February 2026','Rolling',5,'An intercultural youth exchange bringing together participants from Germany, Türkiye, Greece, Serbia, and North Macedonia. Through music, creativity, and collaborative artistic production, participants strengthen cultural understanding, teamwork, and self-expression.',ARRAY['Music','Intercultural','Creativity'],'Open',1),
('democratic-youth-work','Democratic Youth Work in the Green and Digital Era','Training Course','Strumica, North Macedonia','20 – 27 April 2026','Rolling',3,'A youth worker mobility project focused on democratic participation, digital youth work, sustainability, active citizenship, and innovative approaches to engaging young people in the green and digital transition.',ARRAY['Democracy','Digital','Sustainability'],'Open',2),
('team-building-bulgaria','Team Building','Youth Exchange','Banya Village, Bulgaria','18 – 26 May 2026','Rolling',5,'A project designed to develop leadership, teamwork, communication, intercultural dialogue, and problem-solving skills through non-formal education activities and outdoor learning experiences.',ARRAY['Leadership','Teamwork','Outdoor'],'Open',3),
('creating-possibilities-from-scratch','Creating Possibilities – From Scratch','Youth Exchange','Cristuru Secuiesc, Romania','21 – 28 May 2026','Rolling',5,'A youth exchange supporting creativity, entrepreneurship, initiative-taking, and personal development while encouraging young people to transform ideas into practical opportunities.',ARRAY['Entrepreneurship','Creativity','Personal development'],'Open',4),
('bite-into-change','BITE INTO CHANGE – Fighting Food Waste & Overconsumption','Youth Exchange','Rettenegg, Austria','19 – 27 June 2026','Rolling',5,'A sustainability-focused youth exchange addressing food waste, overconsumption, climate action, and responsible lifestyles. Participants explore practical solutions for reducing waste and promoting sustainable habits.',ARRAY['Sustainability','Climate','Food waste'],'Open',5),
('debate-today-lead-tomorrow','Debate Today – Lead Tomorrow','Training Course','Kruševo, North Macedonia','18 – 25 July 2026','Rolling',3,'A youth worker training course focusing on critical thinking, debate methodologies, democratic participation, media literacy, communication skills, and combating misinformation.',ARRAY['Debate','Media literacy','Democracy'],'Upcoming',6),
('the-dopamine-quest','The Dopamine Quest','Youth Exchange','Cristuru Secuiesc, Romania','22 – 31 August 2026','Rolling',5,'A project dedicated to mental health and well-being, exploring healthy habits, emotional resilience, digital balance, self-awareness, happiness, and positive social relationships.',ARRAY['Mental health','Well-being','Digital balance'],'Upcoming',7),
('green-box-slavic-myths','Green Box: Slavic Myths on Screen','Youth Exchange','Krakow, Poland','21 – 29 August 2026','Rolling',5,'An innovative media and culture project where participants explore Slavic mythology, cultural heritage, digital storytelling, and filmmaking while creating creative media products in international teams.',ARRAY['Filmmaking','Culture','Storytelling'],'Upcoming',8),
-- Past projects (Closed)
('past-youth-voices-2024','Youth Voices for Climate','Youth Exchange','Istanbul, Türkiye','10 – 18 September 2024','Closed',24,'A past Erasmus+ youth exchange hosted by BEKGED in Istanbul, bringing together young climate advocates from 5 countries to design grassroots climate campaigns.',ARRAY['Climate','Advocacy','Campaigning'],'Closed',101),
('past-inclusion-lab-2024','Inclusion Lab','Training Course','Ankara, Türkiye','5 – 12 May 2024','Closed',20,'A past training course for youth workers focusing on inclusion strategies, accessible non-formal education, and working with young people with fewer opportunities.',ARRAY['Inclusion','Youth work','Accessibility'],'Closed',102),
('past-bridges-balkans-2023','Bridges Across the Balkans','Youth Exchange','Skopje, North Macedonia','12 – 20 October 2023','Closed',30,'A past intercultural youth exchange connecting young people from Türkiye and the Balkans through storytelling, hiking, and shared cooking workshops.',ARRAY['Intercultural','Storytelling','Outdoor'],'Closed',103),
('past-digital-citizens-2023','Digital Citizens','Training Course','Vilnius, Lithuania','3 – 10 March 2023','Closed',18,'A past training course on digital citizenship, online safety, and combating disinformation for youth workers across Europe.',ARRAY['Digital','Media literacy','Citizenship'],'Closed',104);

INSERT INTO public.announcements (slug,title,date,tag,excerpt) VALUES
('call-sound-lab','Call for participants: Sound Lab in Germany','2026-01-10','Call','We are sending participants (18–30) to a youth exchange in Osterholz-Scharmbeck. Travel, food and accommodation fully covered by Erasmus+.'),
('winter-meetup','BEKGED Winter Meetup — thank you!','2025-12-20','Community','Alumni and curious newcomers joined us for a cozy evening in Kadıköy. Photos, hot tea and big plans for 2026.'),
('info-workshops','Erasmus+ info workshops at youth centers','2025-11-15','News','We are running free Erasmus+ information workshops at youth centers and schools across Istanbul, with online Q&A sessions for participants outside the city.'),
('climate-toolkit','Free toolkit: Youth-led climate workshops','2025-10-12','Resource','Download our toolkit with session plans, energizers and reflection methods for climate education with young people.');

INSERT INTO public.about_sections (key,title,content) VALUES
('mission','Our mission','Welcome to BEKGED! Based in Istanbul, we are dedicated to empowering youth through non-formal education and fostering civil society. Our mission is to provide valuable resources and promote social inclusion for disadvantaged young people, while enhancing diversity and encouraging intercultural learning. Join us in creating a brighter future and raising awareness about the impact of climate change on youth.'),
('activities','Our activities','We run workshops, networking events and information sessions for youth — with a focus on participants from rural areas, smaller cities and groups with fewer opportunities. Our projects span intercultural learning, climate, mental health, democracy and creativity.'),
('founder','About the founder','BEKGED was founded by youth workers in Istanbul who believe non-formal education can change a life. The association has grown from local workshops into an active Erasmus+ sending organisation with partners across Europe.');
