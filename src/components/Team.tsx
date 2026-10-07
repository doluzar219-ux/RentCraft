import { Code2, Compass, Users, Quote, Coffee } from "lucide-react";
import { Reveal, SectionHeading } from "./primitives";
import omAvatar from "../assets/avatars/om-lawate.jpg";
import antaraAvatar from "../assets/avatars/antara-wankhede.jpg";
import { GithubIcon, LinkedinIcon, XIcon } from "./art/BrandIcons";
import { cn } from "../utils/cn";

const FOUNDERS = [
  {
    name: "Om Lawate",
    role: "Co-Founder & Lead Developer",
    tone: "terracotta" as const,
    icon: Code2,
    avatar: omAvatar,
    quote: "I write the code so you never have to write a cheque-book-length paper lease again.",
    tags: ["Full-stack wizardry", "E-sign pipeline", "Vault security"],
    socials: [
      { icon: GithubIcon, label: "GitHub" },
      { icon: LinkedinIcon, label: "LinkedIn" },
      { icon: XIcon, label: "Twitter / X" },
    ],
    rotate: "group-hover:rotate-3",
    doodle: "ships code weekly",
  },
  {
    name: "Antara Wankhede",
    role: "Co-Founder & Product Lead",
    tone: "forest" as const,
    icon: Compass,
    avatar: antaraAvatar,
    quote: "Every screen in RentCraft was obsessed over until renting felt like a warm cup of chai.",
    tags: ["UX research", "Journey design", "Clause library"],
    socials: [
      { icon: LinkedinIcon, label: "LinkedIn" },
      { icon: XIcon, label: "Twitter / X" },
      { icon: GithubIcon, label: "GitHub" },
    ],
    rotate: "group-hover:-rotate-3",
    doodle: "talks to users daily",
  },
];

export default function Team() {
  return (
    <section id="team" className="relative overflow-hidden py-24 sm:py-28">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-terracotta-200 to-transparent" />
      <div className="texture-dots-green pointer-events-none absolute -left-16 top-28 h-72 w-72 opacity-50 [mask-image:radial-gradient(closest-side,black,transparent)]" />

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="The Team"
          eyebrowIcon={<Users className="h-3.5 w-3.5" />}
          tone="forest"
          title={
            <>
              Two builders, <span className="hand-underline-green text-forest-500">one</span> cozy mission
            </>
          }
          copy="RentCraft is crafted by a duo who believe paperwork should never stand between people and their homes."
        />

        <div className="mx-auto mt-16 grid max-w-4xl gap-8 sm:grid-cols-2">
          {FOUNDERS.map((f, i) => (
            <Reveal key={f.name} delay={i * 140} variant={i === 0 ? "left" : "right"} className="h-full">
              <article
                className={cn(
                  "card group relative h-full overflow-hidden p-8 text-center transition-all duration-500 hover:-translate-y-2",
                  f.tone === "terracotta"
                    ? "hover:border-terracotta-200 hover:shadow-lift"
                    : "hover:border-forest-200 hover:shadow-lift-green"
                )}
              >
                {/* corner deco */}
                <div
                  className={cn(
                    "pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity duration-700 group-hover:opacity-25",
                    f.tone === "terracotta" ? "bg-terracotta-400" : "bg-forest-400"
                  )}
                />

                {/* avatar with orbit ring */}
                <div className="relative mx-auto h-32 w-32">
                  <span
                    className={cn(
                      "absolute -inset-2 rounded-full border-2 border-dashed transition-transform duration-700 group-hover:rotate-45",
                      f.tone === "terracotta" ? "border-terracotta-200" : "border-forest-200"
                    )}
                  />
                  <div
                    className={cn(
                      "relative h-full w-full overflow-hidden rounded-full ring-4 ring-white shadow-soft transition-transform duration-500 group-hover:scale-105",
                      f.rotate
                    )}
                  >
                    <img
                      src={f.avatar}
                      alt={`Vector portrait of ${f.name}`}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <span
                    className={cn(
                      "absolute -bottom-1 -right-1 grid h-9 w-9 place-items-center rounded-full border-[3px] border-white text-white shadow-md transition-transform duration-500 group-hover:scale-110",
                      f.tone === "terracotta" ? "bg-terracotta-500" : "bg-forest-500"
                    )}
                  >
                    <f.icon className="h-4 w-4" />
                  </span>
                </div>

                <h3 className="mt-6 text-xl font-extrabold text-ink">{f.name}</h3>
                <span
                  className={cn(
                    "mt-2 inline-block rounded-full px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-wider",
                    f.tone === "terracotta"
                      ? "bg-terracotta-50 text-terracotta-600"
                      : "bg-forest-50 text-forest-600"
                  )}
                >
                  {f.role}
                </span>

                <div className="relative mt-5">
                  <Quote
                    className={cn(
                      "absolute -left-1 -top-1 h-4 w-4 rotate-180",
                      f.tone === "terracotta" ? "text-terracotta-300" : "text-forest-300"
                    )}
                  />
                  <p className="px-4 text-sm font-medium leading-relaxed text-ink-soft">{f.quote}</p>
                </div>

                <div className="mt-5 flex flex-wrap justify-center gap-1.5">
                  {f.tags.map((t) => (
                    <span key={t} className="rounded-full bg-linen px-3 py-1 text-[10px] font-bold text-ink-mute border border-terracotta-100/60">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-terracotta-100/70 pt-5">
                  <span
                    className={cn(
                      "font-hand text-xl font-semibold",
                      f.tone === "terracotta" ? "text-terracotta-400 -rotate-2" : "text-forest-500 rotate-2"
                    )}
                  >
                    {f.doodle}
                  </span>
                  <div className="flex gap-2">
                    {f.socials.map((s) => (
                      <a
                        key={s.label}
                        href="#team"
                        aria-label={`${f.name} on ${s.label}`}
                        className={cn(
                          "grid h-9 w-9 place-items-center rounded-full border bg-white transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:text-white",
                          f.tone === "terracotta"
                            ? "border-terracotta-100 text-terracotta-500 hover:bg-terracotta-500"
                            : "border-forest-100 text-forest-500 hover:bg-forest-500"
                        )}
                      >
                        <s.icon className="h-4 w-4" />
                      </a>
                    ))}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <div className="mx-auto mt-10 flex max-w-lg items-center justify-center gap-2.5 text-sm font-semibold text-ink-mute">
            <Coffee className="h-4 w-4 text-terracotta-500" />
            Fueled by filter coffee in Pune &amp; Nagpur.
          </div>
        </Reveal>
      </div>
    </section>
  );
}
