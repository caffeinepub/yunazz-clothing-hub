import { Gem, Leaf, Sparkles } from "lucide-react";
import { motion } from "motion/react";

const values = [
  {
    icon: Gem,
    title: "Quality",
    description:
      "Every piece is crafted with meticulous attention to detail using premium, long-lasting materials.",
  },
  {
    icon: Leaf,
    title: "Sustainability",
    description:
      "We are committed to responsible sourcing and reducing our environmental footprint at every step.",
  },
  {
    icon: Sparkles,
    title: "Style",
    description:
      "Our designs are guided by a timeless aesthetic — bold enough to be memorable, refined enough to endure.",
  },
];

export default function AboutSection() {
  return (
    <section id="about" className="py-28 px-6 bg-secondary/40 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Image column */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative"
          >
            <div className="relative">
              {/* Decorative background shape */}
              <div className="absolute -top-6 -left-6 w-full h-full bg-accent/20 -z-10" />
              <div className="overflow-hidden">
                <img
                  src="/assets/generated/about-brand-image.dim_800x600.jpg"
                  alt="Yunazz brand studio"
                  className="w-full h-[500px] object-cover"
                  loading="lazy"
                />
              </div>
              {/* Floating quote card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="absolute -bottom-8 -right-4 lg:-right-10 bg-background shadow-luxury-lg p-6 max-w-xs"
              >
                <p className="font-display text-sm font-light italic text-foreground leading-relaxed">
                  "Clothing is an expression of identity — we're here to help
                  you tell your story."
                </p>
                <p className="text-xs tracking-widest uppercase text-muted-foreground mt-3 font-medium">
                  — Yunazz, Founders
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Content column */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{
              duration: 0.8,
              delay: 0.2,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="pt-8 lg:pt-0"
          >
            <p className="text-xs tracking-ultra uppercase text-muted-foreground mb-4 font-medium">
              Our Story
            </p>
            <h2 className="font-display text-5xl md:text-6xl font-light text-foreground leading-tight mb-8">
              About
              <br />
              <span className="italic">Yunazz.</span>
            </h2>
            <div className="w-12 h-px bg-foreground/20 mb-8" />
            <p className="text-foreground/80 leading-relaxed mb-6 text-base">
              Yunazz Clothing Hub was founded with a passion for modern fashion
              that speaks to the bold, the refined, and the everyday. We believe
              clothing is an expression of identity — and we're here to help you
              tell your story.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-12 text-sm">
              Born in the heart of Jakarta, Indonesia, our collections blend
              contemporary silhouettes with timeless craftsmanship. Each piece
              is thoughtfully curated to move with you through every moment of
              your day.
            </p>

            {/* Values */}
            <div className="space-y-6">
              {values.map((value, i) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="mt-0.5 p-2 bg-foreground text-background shrink-0">
                    <value.icon size={14} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-foreground tracking-wide mb-1">
                      {value.title}
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
