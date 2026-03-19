import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "motion/react";
import { useState } from "react";
import type { Product } from "../backend.d";
import { CATEGORIES, SEED_PRODUCTS } from "../data/seedProducts";
import { useProducts } from "../hooks/useQueries";
import ProductCard from "./ProductCard";

export default function ShopSection() {
  const [activeCategory, setActiveCategory] = useState("All");
  const { data: backendProducts, isLoading } = useProducts();

  const allProducts: Product[] =
    backendProducts && backendProducts.length > 0
      ? backendProducts
      : SEED_PRODUCTS;

  const filtered =
    activeCategory === "All"
      ? allProducts
      : allProducts.filter((p) => p.category === activeCategory);

  return (
    <section
      id="shop"
      data-ocid="shop.section"
      className="py-28 px-6 bg-background"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-xs tracking-ultra uppercase text-muted-foreground mb-4 font-medium">
            Our Collection
          </p>
          <h2 className="font-display text-5xl md:text-6xl font-light text-foreground leading-tight">
            The Shop
          </h2>
          <div className="w-12 h-px bg-foreground/20 mx-auto mt-6" />
        </motion.div>

        {/* Category filters */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2 mb-14"
        >
          {CATEGORIES.map((category) => (
            <button
              type="button"
              key={category}
              data-ocid="shop.filter.tab"
              onClick={() => setActiveCategory(category)}
              className={`text-xs font-medium tracking-widest uppercase px-5 py-2.5 border transition-all duration-300 ${
                activeCategory === category
                  ? "bg-foreground text-background border-foreground"
                  : "bg-transparent text-foreground border-border hover:border-foreground/60 hover:bg-muted"
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Product grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }, (_, i) => i).map((i) => (
              <div
                key={`skeleton-${i}`}
                data-ocid="shop.loading_state"
                className="space-y-3"
              >
                <Skeleton className="aspect-[4/5] w-full rounded-none bg-muted" />
                <Skeleton className="h-4 w-3/4 rounded-none bg-muted" />
                <Skeleton className="h-4 w-1/3 rounded-none bg-muted" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            data-ocid="product.empty_state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="font-display text-2xl font-light text-muted-foreground">
              No items in this category yet.
            </p>
            <p className="text-sm text-muted-foreground mt-2 tracking-wide">
              Check back soon for new arrivals.
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((product, index) => (
              <ProductCard
                key={product.id.toString()}
                product={product}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
