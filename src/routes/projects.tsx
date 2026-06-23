import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { site } from "@/data/site";
import { useProjects, type Project } from "@/data/content";

export const Route = createFileRoute("/projects")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Projects & open calls — BEKGED" },
      {
        name: "description",
        content:
          "Browse open Erasmus+ youth exchanges and training courses with BEKGED (Bosphorus Education Culture and Development Association) and apply through our online form.",
      },
      { property: "og:title", content: "Projects & open calls — BEKGED" },
    ],
  }),
  component: Projects,
});

const filters = ["All", "Open", "Upcoming", "Closed"] as const;

function Projects() {
  const { data: projects = [], isLoading } = useProjects();
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [selected, setSelected] = useState<Project | null>(null);

  const list = useMemo(
    () => (filter === "All" ? projects : projects.filter((p) => p.status === filter)),
    [filter, projects],
  );

  return (
    <>
      <Toaster />
      <section className="container-pad py-16 md:py-20">
        <span className="chip">Projects</span>
        <h1 className="mt-4 max-w-3xl font-display text-5xl font-bold md:text-6xl">
          Current Erasmus+ projects & international activities.
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Travel, food and accommodation are covered by the Erasmus+ programme. Pick a project, hit
          apply, and fill in our application form.
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full border-2 border-foreground px-4 py-1.5 text-sm font-semibold transition-all ${
                filter === f ? "bg-foreground text-background" : "bg-background hover:bg-accent"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </section>

      <section className="container-pad pb-20">
        {isLoading ? (
          <p className="text-muted-foreground">Loading projects…</p>
        ) : list.length === 0 ? (
          <p className="text-muted-foreground">No projects in this category yet.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {list.map((p) => (
              <article key={p.slug} className="card-pop flex flex-col">
                <div className="flex items-center justify-between">
                  <span className="chip">{p.type}</span>
                  <StatusPill status={p.status} />
                </div>
                <h3 className="mt-4 font-display text-xl font-bold">{p.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {p.country} · {p.dates}
                </p>
                <p className="mt-3 flex-1 text-sm">{p.summary}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {p.topics.map((t) => (
                    <span key={t} className="rounded-full bg-muted px-2 py-0.5 text-xs">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="mt-5 flex items-center justify-between text-sm">
                  <span className="font-semibold text-primary">Deadline {p.deadline}</span>
                  <button
                    onClick={() => setSelected(p)}
                    disabled={p.status === "Closed"}
                    className="btn-pop !px-4 !py-2 text-xs disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {p.status === "Closed" ? "Closed" : "Başvur / Apply"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {selected && <ApplyModal project={selected} onClose={() => setSelected(null)} />}
    </>
  );
}

function StatusPill({ status }: { status: Project["status"] }) {
  const map: Record<string, { bg: string; text: string }> = {
    Open: { bg: "var(--secondary)", text: "white" },
    Upcoming: { bg: "var(--accent)", text: "var(--ink)" },
    Closed: { bg: "var(--muted)", text: "var(--muted-foreground)" },
  };
  const s = map[status] ?? map.Open;
  return (
    <span
      className="rounded-full border-2 border-foreground px-2 py-0.5 text-xs font-bold uppercase tracking-wider"
      style={{ background: s.bg, color: s.text }}
    >
      {status}
    </span>
  );
}

const passportOptions = ["Bordo Pasaport", "Yeşil Pasaport", "Schengen Vizem Var", "Pasaportum Yok", "Diğer"];
const englishLevels = ["A1", "A2", "B1", "B2", "C1", "C2", "Anadil / Native"];
const barriers = [
  "Sosyal engeller (cinsiyet, etnik köken, din vb. nedeniyle ayrımcılık)",
  "Ekonomik engeller (düşük yaşam standardı, düşük gelir vb.)",
  "Engellilik (zihinsel, fiziksel, duyusal engel)",
  "Eğitimsel güçlükler (öğrenme güçlüğü, okulu erken bırakma vb.)",
  "Kültürel farklılıklar (genç göçmen / mülteci vb.)",
  "Sağlık sorunları (kronik / ağır hastalık, psikiyatrik rahatsızlık vb.)",
  "Coğrafi engeller (uzak, kırsal, küçük ada / çevre bölge vb.)",
  "Ben fırsatları az olan bir genç değilim.",
];

function ApplyModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const city = String(data.get("city") || "").trim();
    const motivation = String(data.get("motivation") || "").trim();
    const consent1 = data.get("consent_truth");
    const consent2 = data.get("consent_kvkk");
    const consentAdult = data.get("consent_adult");
    const consentParent = data.get("consent_parent");
    const barriersSelected = data.getAll("barriers").map(String);

    if (!name || name.length > 100) return toast.error("Lütfen geçerli bir ad-soyad giriniz.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return toast.error("Lütfen geçerli bir e-posta giriniz.");
    if (!phone || phone.length > 30) return toast.error("Lütfen geçerli bir telefon giriniz.");
    if (!city) return toast.error("Lütfen ikamet ettiğiniz şehir ve ilçeyi giriniz.");
    if (motivation.length < 50 || motivation.length > 2000)
      return toast.error("Motivasyon 50–2000 karakter arasında olmalıdır.");
    if (!consent1 || !consent2 || (!consentAdult && !consentParent))
      return toast.error("Lütfen gerekli onay kutularını işaretleyiniz.");

    setSubmitting(true);
    const { error } = await supabase.from("applications").insert({
      project_slug: project.slug,
      project_title: project.title,
      full_name: name,
      email,
      phone,
      birthdate: (String(data.get("birthdate") || "") || null) as any,
      city,
      passport_type: String(data.get("passport_type") || "") || null,
      passport_expiry: (String(data.get("passport_expiry") || "") || null) as any,
      english_level: String(data.get("english_level") || "") || null,
      previous_projects: Number(data.get("previous_projects") || 0),
      barriers: barriersSelected,
      motivation,
      ngo_experience: String(data.get("ngo_experience") || "") || null,
      follow_ig: !!data.get("follow_ig"),
      follow_wa: !!data.get("follow_wa"),
      consent_age: consentAdult ? "18+" : "under_18_with_parent",
      status: "pending",
    });
    setSubmitting(false);

    if (error) {
      toast.error("Başvurunuz gönderilemedi. Lütfen tekrar deneyin.");
      return;
    }
    toast.success("Başvurunuz alındı! En kısa sürede sizinle iletişime geçeceğiz.");
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-foreground/40 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border-2 border-foreground bg-background p-6 sm:rounded-3xl sm:p-8"
        style={{ boxShadow: "var(--shadow-pop)" }}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="chip">{project.type}</span>
            <h2 className="mt-2 font-display text-2xl font-bold">
              "{project.title}" PROJESİ BAŞVURU FORMU
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {project.country} · {project.dates}
            </p>
            <p className="mt-2 rounded-xl border-2 border-dashed border-foreground/40 px-3 py-2 text-xs text-muted-foreground">
              Not: Bu form Türkçe veya İngilizce dilinde doldurulabilir.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Kapat"
            className="shrink-0 rounded-full border-2 border-foreground px-3 py-1 text-sm"
          >
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit} className="mt-6 space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Ad Soyad">
              <input name="name" required maxLength={100} className="input-base" autoComplete="name" />
            </Field>
            <Field label="E-posta">
              <input type="email" name="email" required maxLength={255} className="input-base" autoComplete="email" />
            </Field>
            <Field label="Telefon (WhatsApp)">
              <input name="phone" required maxLength={30} className="input-base" autoComplete="tel" />
            </Field>
            <Field label="Doğum Tarihi">
              <input type="date" name="birthdate" required className="input-base" />
            </Field>
          </div>

          <Field label="Proje Süresince İkamet Edilen Şehir ve İlçe (Türkiye'de)">
            <input name="city" required maxLength={120} className="input-base" />
          </Field>

          <Field label="Pasaport türü (Etkinlik yerelse boş bırakınız)">
            <select name="passport_type" className="input-base" defaultValue="">
              <option value="">— Seçiniz —</option>
              {passportOptions.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </Field>

          <Field label="Pasaport Geçerlilik Tarihi (yerelse boş bırakınız)">
            <input type="date" name="passport_expiry" className="input-base" />
          </Field>

          <Field label="İngilizce Konuşma Seviyesi (yerelse boş bırakınız)">
            <select name="english_level" className="input-base" defaultValue="">
              <option value="">— Seçiniz —</option>
              {englishLevels.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </Field>

          <Field label="Daha önce kaç Erasmus+ projesine katıldınız?">
            <input type="number" name="previous_projects" min={0} max={99} required className="input-base" />
          </Field>

          <fieldset>
            <legend className="mb-2 block text-sm font-semibold">
              Erasmus+ kapsamında hangi zorluklarla karşılaşıyorsunuz? (Birden fazla seçim mümkün)
            </legend>
            <div className="space-y-2 rounded-xl border-2 border-foreground/20 p-3">
              {barriers.map((b) => (
                <label key={b} className="flex items-start gap-2 text-sm">
                  <input type="checkbox" name="barriers" value={b} className="mt-1 h-4 w-4 accent-[var(--primary)]" />
                  <span>{b}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <Field label="Projeye başvurma motivasyonunuz (lütfen yapay zeka kullanmayınız) — 50–2000 karakter">
            <textarea name="motivation" required minLength={50} maxLength={2000} rows={6} className="input-base resize-none" />
          </Field>

          <fieldset>
            <legend className="mb-2 block text-sm font-semibold">
              Instagram hesabımızı ve WhatsApp kanalımızı takip ettiniz mi?
            </legend>
            <div className="grid gap-2 sm:grid-cols-2">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="follow_ig" className="h-4 w-4 accent-[var(--primary)]" />
                <a href="https://www.instagram.com/bekgedernegi/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
                  Instagram: @bekgedernegi
                </a>
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="follow_wa" className="h-4 w-4 accent-[var(--primary)]" />
                <a href="https://whatsapp.com/channel/0029VaGOdZJ35fLqypFjCY3V" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
                  WhatsApp Kanalımız
                </a>
              </label>
            </div>
          </fieldset>

          <Field label="Üyesi / gönüllüsü olduğunuz STK veya topluluklar ve rolünüz (varsa)">
            <textarea name="ngo_experience" maxLength={1000} rows={3} className="input-base resize-none" />
          </Field>

          <div className="space-y-3 rounded-xl border-2 border-foreground/30 bg-muted/30 p-4 text-sm">
            <label className="flex items-start gap-2">
              <input type="checkbox" name="consent_truth" required className="mt-1 h-4 w-4 accent-[var(--primary)]" />
              <span>
                Bu başvuru formunda verdiğim bilgilerin doğru olduğunu beyan ederim. Etkinlik tarihlerinde müsaitim ve seçilmem halinde katılacağım. Koordinatörümün talimatlarını takip edeceğim ve iletişim gruplarına (WhatsApp vb.) eklenmeyi kabul ediyorum.
              </span>
            </label>
            <label className="flex items-start gap-2">
              <input type="checkbox" name="consent_kvkk" required className="mt-1 h-4 w-4 accent-[var(--primary)]" />
              <span>
                Kişisel verilerimin 6698 sayılı KVKK kapsamında işlenmesine ve etkinlik fotoğraf/videolarımın görünürlük, yaygınlaştırma ve raporlama amacıyla organizatör ve ortak kuruluşlar tarafından kullanılmasına/paylaşılmasına (Erasmus+ projelerinde AB kurumlarıyla da) izin veriyorum.
              </span>
            </label>
            <div className="border-t-2 border-foreground/20 pt-3">
              <p className="mb-2 font-semibold">Yaş onayı (birini işaretleyiniz):</p>
              <label className="flex items-start gap-2">
                <input type="checkbox" name="consent_adult" className="mt-1 h-4 w-4 accent-[var(--primary)]" />
                <span>18 yaşının üzerindeyim. Verilerimin etkinliğin diğer katılımcıları, kolaylaştırıcıları ve koordinatörleriyle paylaşılmasına onay veriyorum.</span>
              </label>
              <label className="mt-2 flex items-start gap-2">
                <input type="checkbox" name="consent_parent" className="mt-1 h-4 w-4 accent-[var(--primary)]" />
                <span>18 yaşın altındayım — bu formu velim onayıyla doldurdum ve verilerimin etkinlik katılımcıları, kolaylaştırıcıları ve koordinatörleriyle paylaşılmasına velim adıma onay veriyor.</span>
              </label>
            </div>
          </div>

          <button type="submit" disabled={submitting} className="btn-pop w-full disabled:opacity-60">
            {submitting ? "Gönderiliyor…" : "Başvuruyu Gönder"}
          </button>
          <p className="text-center text-xs text-muted-foreground">
            Başvurunuz {site.email} adresine ulaşacaktır.
          </p>
        </form>

        <style>{`.input-base{width:100%;border:2px solid var(--ink);border-radius:0.75rem;padding:0.6rem 0.85rem;background:var(--background);font-family:var(--font-sans);font-size:0.95rem}.input-base:focus{outline:none;box-shadow:3px 3px 0 0 var(--ink);transform:translate(-1px,-1px)}`}</style>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold">{label}</span>
      {children}
    </label>
  );
}
