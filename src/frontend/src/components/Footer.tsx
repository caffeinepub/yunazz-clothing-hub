import { Heart } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  const navLinks = [
    { label: "Home", target: "hero" },
    { label: "Shop", target: "shop" },
    { label: "About", target: "about" },
    { label: "Contact", target: "contact" },
  ];

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-foreground text-background py-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-12 border-b border-background/10">
          {/* Brand */}
          <div>
            <img
              src="/assets/generated/yunazz-logo-transparent.dim_400x120.png"
              alt="Yunazz Clothing Hub"
              className="h-8 w-auto object-contain brightness-0 invert mb-4"
            />
            <p className="text-background/60 text-sm leading-relaxed max-w-xs">
              Modern fashion that speaks to the bold, the refined, and the
              everyday.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs tracking-widest uppercase text-background/50 font-medium mb-5">
              Navigation
            </h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <button
                    type="button"
                    onClick={() => scrollTo(link.target)}
                    className="text-sm text-background/75 hover:text-background transition-colors tracking-wide"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs tracking-widest uppercase text-background/50 font-medium mb-5">
              Contact
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:hello@yunazz.com"
                  className="text-sm text-background/75 hover:text-background transition-colors"
                >
                  hello@yunazz.com
                </a>
              </li>
              <li>
                <span className="text-sm text-background/75">
                  Jakarta, Indonesia
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-background/40 text-xs tracking-wide">
            © {year} Yunazz Clothing Hub. All rights reserved.
          </p>
          <a
            href={caffeineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-background/40 hover:text-background/60 text-xs tracking-wide transition-colors flex items-center gap-1.5"
          >
            Built with <Heart size={10} className="fill-current" /> using
            caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
