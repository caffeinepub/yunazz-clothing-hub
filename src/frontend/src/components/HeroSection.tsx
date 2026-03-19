import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import { motion } from "motion/react";

export default function HeroSection() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden"
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="/assets/generated/hero-banner.dim_1600x900.jpg"
          alt="Yunazz hero"
          className="w-full h-full object-cover object-center"
          loading="eager"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 hero-overlay" />
        {/* Subtle grain */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-6 max-w-5xl mx-auto">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <img
            src="/assets/generated/yunazz-logo-transparent.dim_400x120.png"
            alt="Yunazz Clothing Hub"
            className="h-14 w-auto mx-auto object-contain brightness-0 invert"
          />
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-16 h-px bg-white/50 mx-auto mb-10"
        />

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          className="font-display text-6xl md:text-8xl lg:text-9xl font-light leading-none tracking-tight mb-6 text-white"
        >
          Define Your
          <br />
          <span className="italic text-white/90">Style.</span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-white/75 text-base md:text-lg tracking-widest uppercase font-medium mb-12 max-w-md mx-auto"
        >
          Explore the latest collections from Yunazz Clothing Hub
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button
            data-ocid="hero.primary_button"
            onClick={() => scrollTo("shop")}
            size="lg"
            className="bg-white text-foreground hover:bg-white/90 font-medium tracking-widest uppercase text-xs h-13 px-10 rounded-none transition-all duration-300 hover:shadow-luxury-lg"
          >
            Shop Now
          </Button>
          <Button
            data-ocid="hero.secondary_button"
            onClick={() => scrollTo("about")}
            variant="outline"
            size="lg"
            className="border-white/60 text-white hover:bg-white/10 hover:border-white font-medium tracking-widest uppercase text-xs h-13 px-10 rounded-none transition-all duration-300"
          >
            Our Story
          </Button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.4 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60 cursor-pointer"
        onClick={() => scrollTo("shop")}
      >
        <span className="text-xs tracking-ultra uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <ArrowDown size={16} />
        </motion.div>
      </motion.div>
    </section>
  );
}
