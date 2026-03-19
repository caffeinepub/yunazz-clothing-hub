# Yunazz Clothing Hub

## Current State
New project. No existing code or backend.

## Requested Changes (Diff)

### Add
- Homepage with hero banner section showcasing the brand
- Product catalog/shop section with clothing items (photo, name, price, category, description)
- About Us section with brand story content
- Contact section with contact information and form
- Admin management panel (protected) for adding, editing, and removing products
- Product data model: id, name, description, price, category, imageId (blob), createdAt
- Categories: Men, Women, Accessories, Outerwear
- Sample seed products for demonstration

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan

### Backend (Motoko)
- Product record type: { id, name, description, price, category, imageId, createdAt }
- CRUD operations: addProduct, updateProduct, removeProduct, getProducts, getProduct
- Authorization: admin-only write operations, public read
- Blob storage integration for product images

### Frontend
- Navigation bar with links: Home, Shop, About, Contact, Admin (admin-only)
- Hero section: full-width banner with brand tagline and CTA button to shop
- Shop/Catalog section: product grid with filter by category, product cards (image, name, price, category badge)
- Product detail modal or card expand view
- About Us section: brand story, values, mission
- Contact section: contact form (name, email, message) and brand contact info
- Admin panel (protected route/section):
  - Product list with edit/delete per item
  - Add product form: name, description, price, category, image upload
  - Edit product form: pre-filled fields
  - Confirmation dialogs for delete
