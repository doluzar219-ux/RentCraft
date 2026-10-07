import { Heart, MapPin, Mail, ArrowUpRight } from "lucide-react";
import { Logo } from "./Navbar";
import { GithubIcon, InstagramIcon, LinkedinIcon, XIcon } from "./art/BrandIcons";

const COLUMNS = [
  {
    title: "Product",
    links: ["Features", "Workflow", "Live demo", "Pricing"],
    hrefs: ["#features", "#workflow", "#dashboard", "#pricing"],
  },
  {
    title: "Company",
    links: ["Our team", "Careers", "Press kit", "Contact"],
    hrefs: ["#team", "#team", "#team", "#footer"],
  },
  {
    title: "Trust",
    links: ["Security", "Privacy policy", "Terms of use", "Data vault"],
    hrefs: ["#features", "#footer", "#footer", "#features"],
  },
];

const SOCIALS = [
  { icon: LinkedinIcon, label: "LinkedIn" },
  { icon: XIcon, label: "Twitter / X" },
  { icon: InstagramIcon, label: "Instagram" },
  { icon: GithubIcon, label: "GitHub" },
];

export default function Footer() {
  return (
    <footer id="footer" className="relative overflow-hidden bg-forest-900 text-forest-100">
      <div className="texture-dots pointer-events-none absolute right-0 top-0 h-72 w-72 opacity-[0.07] [mask-image:radial-gradient(closest-side,black,transparent)]" />
      <div className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-forest-700/40 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr]">
          {/* brand */}
          <div>
            <div className="[&_span]:text-cream">
              <Logo light />
            </div>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-forest-200/90">
              The automated digital lease &amp; smart verification platform.
              Paperless agreements, verified people, cozy dashboards.
            </p>
            <div className="mt-6 space-y-2.5 text-sm font-medium text-forest-200/90">
              <p className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-terracotta-400" /> Pune · Nagpur, India
              </p>
              <p className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-terracotta-400" /> hello@rentcraft.io
              </p>
            </div>
            <div className="mt-6 flex gap-2.5">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href="#footer"
                  aria-label={s.label}
                  className="grid h-10 w-10 place-items-center rounded-full border border-forest-700 bg-forest-800 text-forest-200 transition-all duration-300 hover:-translate-y-1 hover:border-terracotta-500 hover:bg-terracotta-500 hover:text-white"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* links */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h4 className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-terracotta-300">
                  {col.title}
                </h4>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((link, i) => (
                    <li key={link}>
                      <a
                        href={col.hrefs[i]}
                        className="group inline-flex items-center gap-1 text-sm font-semibold text-forest-200/85 transition-colors hover:text-cream"
                      >
                        {link}
                        <ArrowUpRight className="h-3 w-3 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-forest-700/60 pt-7 text-xs font-medium text-forest-300/80 sm:flex-row">
          <p>© 2026 RentCraft Technologies Pvt. Ltd. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Crafted with <Heart className="h-3.5 w-3.5 fill-terracotta-400 text-terracotta-400" /> by
            Om Lawate &amp; Antara Wankhede
          </p>
        </div>
      </div>
    </footer>
  );
}
