import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

interface NavbarProps {
  isAdmin: boolean;
  onAdminClick: () => void;
}

export default function Navbar({ isAdmin, onAdminClick }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setMenuOpen(false);
    }
  };

  const navLinks = [
    { id: "home", label: "Home", target: "hero" },
    { id: "shop", label: "Shop", target: "shop" },
    { id: "about", label: "About", target: "about" },
    { id: "contact", label: "Contact", target: "contact" },
  ];

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/95 nav-blur border-b border-border shadow-luxury"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <button
          type="button"
          onClick={() => scrollTo("hero")}
          className="flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
          aria-label="Go to top"
        >
          <img
            src="/assets/generated/yunazz-logo-transparent.dim_400x120.png"
            alt="Yunazz Clothing Hub"
            className={`h-8 w-auto object-contain transition-all duration-300 ${
              scrolled ? "" : "brightness-0 invert"
            }`}
          />
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              type="button"
              key={link.id}
              data-ocid={`nav.${link.id}.link`}
              onClick={() => scrollTo(link.target)}
              className={`text-sm font-medium tracking-widest uppercase transition-colors duration-200 focus-visible:outline-none focus-visible:underline ${
                scrolled
                  ? "text-foreground hover:text-accent"
                  : "text-white/90 hover:text-white"
              }`}
            >
              {link.label}
            </button>
          ))}

          {isAdmin && (
            <Button
              data-ocid="nav.admin.link"
              onClick={onAdminClick}
              variant="outline"
              size="sm"
              className={`text-xs tracking-widest uppercase font-medium border transition-all duration-200 ${
                scrolled
                  ? "border-foreground text-foreground hover:bg-foreground hover:text-background"
                  : "border-white/60 text-white hover:bg-white/10"
              }`}
            >
              Admin
            </Button>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className={`md:hidden p-2 rounded focus-visible:ring-2 focus-visible:ring-ring transition-colors ${
            scrolled ? "text-foreground" : "text-white"
          }`}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden overflow-hidden bg-background/98 nav-blur border-b border-border"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <button
                  type="button"
                  key={link.id}
                  data-ocid={`nav.${link.id}.link`}
                  onClick={() => scrollTo(link.target)}
                  className="text-left text-sm font-medium tracking-widest uppercase text-foreground hover:text-accent transition-colors py-2 border-b border-border last:border-b-0"
                >
                  {link.label}
                </button>
              ))}
              {isAdmin && (
                <button
                  type="button"
                  data-ocid="nav.admin.link"
                  onClick={() => {
                    setMenuOpen(false);
                    onAdminClick();
                  }}
                  className="text-left text-sm font-medium tracking-widest uppercase text-foreground hover:text-accent transition-colors py-2"
                >
                  Admin Panel
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
