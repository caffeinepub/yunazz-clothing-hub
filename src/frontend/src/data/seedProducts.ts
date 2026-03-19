import type { Product } from "../backend.d";

export const SEED_PRODUCTS: Product[] = [
  {
    id: 1n,
    name: "Classic Oversized Tee",
    category: "Men",
    price: 29.99,
    description:
      "A timeless oversized t-shirt crafted from 100% premium cotton. Perfect for a relaxed, casual look.",
    imageId: "/assets/generated/product-mens-tshirt.dim_600x750.jpg",
    createdAt: 0n,
  },
  {
    id: 2n,
    name: "Blush Midi Dress",
    category: "Women",
    price: 89.99,
    description:
      "A flowy midi dress in dusty rose. Elegant and comfortable, ideal for day-to-night wear.",
    imageId: "/assets/generated/product-womens-dress.dim_600x750.jpg",
    createdAt: 0n,
  },
  {
    id: 3n,
    name: "Leather Crossbody Bag",
    category: "Accessories",
    price: 119.99,
    description:
      "Premium genuine leather crossbody bag in camel tan. Versatile and stylish for every occasion.",
    imageId: "/assets/generated/product-bag.dim_600x750.jpg",
    createdAt: 0n,
  },
  {
    id: 4n,
    name: "Navy Slim Chinos",
    category: "Men",
    price: 59.99,
    description:
      "Slim-fit chino trousers in classic navy. Smart casual essential for modern men.",
    imageId: "/assets/generated/product-mens-chinos.dim_600x750.jpg",
    createdAt: 0n,
  },
  {
    id: 5n,
    name: "Cream Knit Sweater",
    category: "Women",
    price: 74.99,
    description:
      "Oversized cream knit sweater with ribbed cuffs. Cozy luxury for the cooler months.",
    imageId: "/assets/generated/product-womens-sweater.dim_600x750.jpg",
    createdAt: 0n,
  },
  {
    id: 6n,
    name: "Camel Wool Overcoat",
    category: "Outerwear",
    price: 249.99,
    description:
      "Luxurious camel-toned wool blend overcoat. A wardrobe investment that never goes out of style.",
    imageId: "/assets/generated/product-coat.dim_600x750.jpg",
    createdAt: 0n,
  },
];

export const CATEGORIES = ["All", "Men", "Women", "Accessories", "Outerwear"];
