import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { Product } from "../backend.d";

interface ProductCardProps {
  product: Product;
  index: number;
}

function getImageUrl(imageId: string): string {
  if (!imageId) return "/placeholder.jpg";
  if (imageId.startsWith("/") || imageId.startsWith("http")) return imageId;
  return imageId;
}

const categoryColors: Record<string, string> = {
  Men: "bg-secondary text-secondary-foreground",
  Women: "bg-accent/20 text-accent-foreground",
  Accessories: "bg-gold/20 text-gold-foreground",
  Outerwear: "bg-muted text-muted-foreground",
};

export default function ProductCard({ product, index }: ProductCardProps) {
  const [showDetail, setShowDetail] = useState(false);
  const imgSrc = getImageUrl(product.imageId);
  const ocidIndex = index + 1;

  return (
    <>
      <motion.div
        data-ocid={`product.item.${ocidIndex}`}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{
          duration: 0.5,
          delay: index * 0.08,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        className="group bg-card rounded-none overflow-hidden product-card-hover cursor-pointer"
        onClick={() => setShowDetail(true)}
      >
        {/* Image container */}
        <div className="relative overflow-hidden aspect-[4/5] bg-muted">
          <img
            src={imgSrc}
            alt={product.name}
            className="w-full h-full object-cover image-zoom-inner transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/8 transition-all duration-400" />

          {/* Category badge on image */}
          <div className="absolute top-3 left-3">
            <span
              className={`text-[10px] font-medium tracking-widest uppercase px-2 py-1 ${
                categoryColors[product.category] ||
                "bg-secondary text-secondary-foreground"
              }`}
            >
              {product.category}
            </span>
          </div>

          {/* Quick view hint on hover */}
          <div className="absolute inset-0 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="bg-background/90 text-foreground text-xs tracking-widest uppercase px-4 py-2 font-medium">
              Quick View
            </span>
          </div>
        </div>

        {/* Product info */}
        <div className="p-4">
          <h3 className="font-display text-base font-light text-foreground mb-1 leading-snug">
            {product.name}
          </h3>
          <p className="text-sm font-semibold text-foreground tracking-wide">
            ${product.price.toFixed(2)}
          </p>
        </div>

        {/* View Details button */}
        <div className="px-4 pb-4">
          <Button
            data-ocid={`product.view_details.button.${ocidIndex}`}
            variant="outline"
            size="sm"
            className="w-full rounded-none text-xs tracking-widest uppercase font-medium border-foreground/20 hover:border-foreground hover:bg-foreground hover:text-background transition-all duration-300"
            onClick={(e) => {
              e.stopPropagation();
              setShowDetail(true);
            }}
          >
            View Details
          </Button>
        </div>
      </motion.div>

      {/* Product Detail Modal */}
      <Dialog open={showDetail} onOpenChange={setShowDetail}>
        <DialogContent
          data-ocid="product.modal.dialog"
          className="max-w-2xl p-0 overflow-hidden rounded-none border-border bg-card"
        >
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Image */}
            <div className="relative aspect-[3/4] md:aspect-auto bg-muted overflow-hidden">
              <img
                src={imgSrc}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Details */}
            <div className="p-8 flex flex-col justify-between">
              <div>
                <button
                  type="button"
                  data-ocid="product.modal.close_button"
                  onClick={() => setShowDetail(false)}
                  className="absolute top-4 right-4 p-1.5 rounded-full bg-background/80 hover:bg-background text-foreground/60 hover:text-foreground transition-colors focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label="Close"
                >
                  <X size={16} />
                </button>

                <span
                  className={`text-[10px] font-medium tracking-widest uppercase px-2 py-1 mb-4 inline-block ${
                    categoryColors[product.category] ||
                    "bg-secondary text-secondary-foreground"
                  }`}
                >
                  {product.category}
                </span>

                <DialogHeader>
                  <DialogTitle className="font-display text-2xl font-light text-foreground leading-tight mt-2">
                    {product.name}
                  </DialogTitle>
                </DialogHeader>

                <p className="text-2xl font-semibold text-foreground mt-3 mb-6">
                  ${product.price.toFixed(2)}
                </p>

                <div className="w-8 h-px bg-border mb-6" />

                <p className="text-sm text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="mt-8">
                <Button
                  className="w-full rounded-none bg-foreground text-background hover:bg-foreground/90 text-xs tracking-widest uppercase font-medium h-12 transition-all duration-300"
                  onClick={() => setShowDetail(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
