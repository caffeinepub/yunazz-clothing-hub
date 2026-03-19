import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { HttpAgent } from "@icp-sdk/core/agent";
import {
  ArrowLeft,
  ImageIcon,
  Loader2,
  LogIn,
  LogOut,
  Pencil,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import type { Product } from "../backend.d";
import { loadConfig } from "../config";
import { CATEGORIES, SEED_PRODUCTS } from "../data/seedProducts";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAddProduct,
  useIsAdmin,
  useProducts,
  useRemoveProduct,
  useUpdateProduct,
} from "../hooks/useQueries";
import { StorageClient } from "../utils/StorageClient";

interface AdminPanelProps {
  onClose: () => void;
}

interface ProductForm {
  name: string;
  description: string;
  price: string;
  category: string;
  imageId: string;
}

const emptyForm: ProductForm = {
  name: "",
  description: "",
  price: "",
  category: "",
  imageId: "",
};

async function createStorageClient(identity?: any) {
  const config = await loadConfig();
  const agent = identity
    ? await HttpAgent.create({ identity, host: (config as any).host })
    : await HttpAgent.create({ host: (config as any).host });
  return new StorageClient(
    "products",
    (config as any).storage_gateway_url,
    (config as any).backend_canister_id,
    (config as any).project_id,
    agent,
  );
}

export default function AdminPanel({ onClose }: AdminPanelProps) {
  const { login, clear, loginStatus, identity, isInitializing } =
    useInternetIdentity();
  const { data: isAdmin, isLoading: isAdminLoading } = useIsAdmin();
  const { data: backendProducts, isLoading: productsLoading } = useProducts();

  const addProduct = useAddProduct();
  const updateProduct = useUpdateProduct();
  const removeProduct = useRemoveProduct();

  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const allProducts =
    backendProducts && backendProducts.length > 0
      ? backendProducts
      : SEED_PRODUCTS;

  const openAddForm = () => {
    setEditingProduct(null);
    setForm(emptyForm);
    setImagePreview("");
    setFormOpen(true);
  };

  const openEditForm = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      imageId: product.imageId,
    });
    setImagePreview(product.imageId.startsWith("/") ? product.imageId : "");
    setFormOpen(true);
  };

  const handleImageUpload = useCallback(
    async (file: File) => {
      if (!identity) {
        toast.error("Please log in to upload images");
        return;
      }
      try {
        setIsUploading(true);
        setUploadProgress(0);
        const reader = new FileReader();
        reader.onload = (e) => setImagePreview(e.target?.result as string);
        reader.readAsDataURL(file);

        const storageClient = await createStorageClient(identity);
        const bytes = new Uint8Array(await file.arrayBuffer());
        const { hash } = await storageClient.putFile(bytes, (pct) => {
          setUploadProgress(pct);
        });
        setForm((f) => ({ ...f, imageId: hash }));
        toast.success("Image uploaded successfully");
      } catch (err) {
        console.error(err);
        toast.error("Image upload failed. Please try again.");
        setImagePreview("");
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    },
    [identity],
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const price = Number.parseFloat(form.price);
    if (Number.isNaN(price) || price <= 0) {
      toast.error("Please enter a valid price");
      return;
    }
    if (!form.category) {
      toast.error("Please select a category");
      return;
    }

    try {
      if (editingProduct) {
        await updateProduct.mutateAsync({
          id: editingProduct.id,
          name: form.name,
          description: form.description,
          price,
          category: form.category,
          imageId: form.imageId,
        });
        toast.success("Product updated successfully");
      } else {
        await addProduct.mutateAsync({
          name: form.name,
          description: form.description,
          price,
          category: form.category,
          imageId: form.imageId,
        });
        toast.success("Product added successfully");
      }
      setFormOpen(false);
      setForm(emptyForm);
      setImagePreview("");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await removeProduct.mutateAsync(deleteTarget.id);
      toast.success("Product removed");
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove product");
    }
  };

  const isLoggedIn = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  return (
    <div data-ocid="admin.panel" className="min-h-screen bg-background">
      {/* Admin Navbar */}
      <header className="sticky top-0 z-40 bg-foreground text-background border-b border-background/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              data-ocid="admin.back.button"
              onClick={onClose}
              className="flex items-center gap-2 text-background/70 hover:text-background text-sm transition-colors"
            >
              <ArrowLeft size={16} />
              <span className="tracking-wide">Back to Store</span>
            </button>
            <span className="text-background/30">|</span>
            <h1 className="font-display text-lg font-light text-background">
              Admin Panel
            </h1>
          </div>

          {isInitializing ? (
            <Skeleton className="h-9 w-28 bg-background/20" />
          ) : isLoggedIn ? (
            <Button
              data-ocid="admin.logout.button"
              onClick={clear}
              variant="ghost"
              size="sm"
              className="text-background/70 hover:text-background hover:bg-background/10 text-xs tracking-widest uppercase font-medium gap-2"
            >
              <LogOut size={14} />
              Log Out
            </Button>
          ) : (
            <Button
              data-ocid="admin.login.button"
              onClick={login}
              disabled={isLoggingIn}
              size="sm"
              className="bg-background text-foreground hover:bg-background/90 text-xs tracking-widest uppercase font-medium gap-2 rounded-none"
            >
              {isLoggingIn ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <LogIn size={14} />
              )}
              {isLoggingIn ? "Connecting..." : "Log In"}
            </Button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Auth gate */}
        {!isLoggedIn && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-32 text-center"
          >
            <div className="w-16 h-16 bg-foreground/8 flex items-center justify-center mb-6">
              <LogIn size={24} className="text-muted-foreground" />
            </div>
            <h2 className="font-display text-3xl font-light text-foreground mb-3">
              Admin Access Required
            </h2>
            <p className="text-muted-foreground text-sm mb-8 max-w-sm">
              Log in with Internet Identity to manage your product catalog.
            </p>
            <Button
              data-ocid="admin.login.button"
              onClick={login}
              disabled={isLoggingIn}
              className="rounded-none bg-foreground text-background hover:bg-foreground/90 text-xs tracking-widest uppercase font-medium h-12 px-10 gap-2"
            >
              {isLoggingIn ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <LogIn size={14} />
              )}
              {isLoggingIn ? "Connecting..." : "Log In with Internet Identity"}
            </Button>
          </motion.div>
        )}

        {/* Admin check */}
        {isLoggedIn && !isAdminLoading && !isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-32 text-center"
          >
            <h2 className="font-display text-3xl font-light text-foreground mb-3">
              Access Denied
            </h2>
            <p className="text-muted-foreground text-sm">
              Your account does not have admin privileges.
            </p>
          </motion.div>
        )}

        {/* Main admin content */}
        {isLoggedIn && (isAdminLoading || isAdmin) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {/* Header row */}
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="font-display text-4xl font-light text-foreground">
                  Products
                </h2>
                <p className="text-muted-foreground text-sm mt-1">
                  Manage your product catalog
                </p>
              </div>
              <Button
                data-ocid="admin.add_product.button"
                onClick={openAddForm}
                className="rounded-none bg-foreground text-background hover:bg-foreground/90 text-xs tracking-widest uppercase font-medium h-11 px-6 gap-2"
              >
                <Plus size={14} />
                Add Product
              </Button>
            </div>

            {/* Products table */}
            {productsLoading ? (
              <div
                data-ocid="admin.products.loading_state"
                className="space-y-3"
              >
                {Array.from({ length: 4 }, (_, i) => i).map((i) => (
                  <Skeleton
                    key={`admin-skeleton-${i}`}
                    className="h-16 w-full rounded-none bg-muted"
                  />
                ))}
              </div>
            ) : (
              <div className="border border-border">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border bg-muted/50">
                      <TableHead className="text-xs tracking-widest uppercase text-muted-foreground font-medium py-4">
                        Product
                      </TableHead>
                      <TableHead className="text-xs tracking-widest uppercase text-muted-foreground font-medium">
                        Category
                      </TableHead>
                      <TableHead className="text-xs tracking-widest uppercase text-muted-foreground font-medium">
                        Price
                      </TableHead>
                      <TableHead className="text-xs tracking-widest uppercase text-muted-foreground font-medium text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allProducts.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          data-ocid="admin.products.empty_state"
                          className="text-center py-16 text-muted-foreground text-sm"
                        >
                          No products yet. Add your first product above.
                        </TableCell>
                      </TableRow>
                    ) : (
                      allProducts.map((product, index) => (
                        <TableRow
                          key={product.id.toString()}
                          data-ocid={`admin.product.item.${index + 1}`}
                          className="border-border hover:bg-muted/30 transition-colors"
                        >
                          <TableCell className="py-4">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-14 bg-muted overflow-hidden shrink-0">
                                {product.imageId ? (
                                  <img
                                    src={
                                      product.imageId.startsWith("/") ||
                                      product.imageId.startsWith("http")
                                        ? product.imageId
                                        : product.imageId
                                    }
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <ImageIcon
                                      size={14}
                                      className="text-muted-foreground"
                                    />
                                  </div>
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-sm text-foreground">
                                  {product.name}
                                </p>
                                <p className="text-xs text-muted-foreground line-clamp-1 max-w-xs mt-0.5">
                                  {product.description}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="text-xs tracking-wide rounded-none border-border font-normal"
                            >
                              {product.category}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-semibold text-sm">
                            ${product.price.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                data-ocid={`admin.product.edit_button.${index + 1}`}
                                variant="ghost"
                                size="sm"
                                onClick={() => openEditForm(product)}
                                className="h-8 w-8 p-0 hover:bg-muted rounded-none text-muted-foreground hover:text-foreground"
                                aria-label="Edit product"
                              >
                                <Pencil size={14} />
                              </Button>
                              <Button
                                data-ocid={`admin.product.delete_button.${index + 1}`}
                                variant="ghost"
                                size="sm"
                                onClick={() => setDeleteTarget(product)}
                                className="h-8 w-8 p-0 hover:bg-destructive/10 rounded-none text-muted-foreground hover:text-destructive"
                                aria-label="Delete product"
                              >
                                <Trash2 size={14} />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </motion.div>
        )}
      </main>

      {/* Add/Edit Product Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent
          data-ocid="admin.product.form.dialog"
          className="max-w-lg rounded-none border-border bg-background"
        >
          <DialogHeader>
            <DialogTitle className="font-display text-2xl font-light text-foreground">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleFormSubmit} className="space-y-5 mt-2">
            {/* Name */}
            <div className="space-y-2">
              <Label className="text-xs tracking-widest uppercase text-muted-foreground font-medium">
                Product Name
              </Label>
              <Input
                data-ocid="admin.product.name.input"
                required
                placeholder="e.g. Classic Oversized Tee"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                className="rounded-none border-border bg-background focus:border-foreground h-11 text-sm"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label className="text-xs tracking-widest uppercase text-muted-foreground font-medium">
                Description
              </Label>
              <Textarea
                data-ocid="admin.product.description.textarea"
                required
                placeholder="Describe the product..."
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                className="rounded-none border-border bg-background focus:border-foreground text-sm resize-none"
              />
            </div>

            {/* Price + Category row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs tracking-widest uppercase text-muted-foreground font-medium">
                  Price ($)
                </Label>
                <Input
                  data-ocid="admin.product.price.input"
                  required
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="29.99"
                  value={form.price}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, price: e.target.value }))
                  }
                  className="rounded-none border-border bg-background focus:border-foreground h-11 text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs tracking-widest uppercase text-muted-foreground font-medium">
                  Category
                </Label>
                <Select
                  value={form.category}
                  onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}
                >
                  <SelectTrigger
                    data-ocid="admin.product.category.select"
                    className="rounded-none border-border bg-background h-11 text-sm"
                  >
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent className="rounded-none border-border">
                    {CATEGORIES.filter((c) => c !== "All").map((cat) => (
                      <SelectItem key={cat} value={cat} className="text-sm">
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Image upload */}
            <div className="space-y-2">
              <Label className="text-xs tracking-widest uppercase text-muted-foreground font-medium">
                Product Image
              </Label>
              <div className="border border-border p-4 space-y-3">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview("");
                        setForm((f) => ({ ...f, imageId: "" }));
                      }}
                      className="absolute top-2 right-2 bg-background/80 text-foreground hover:bg-background p-1 text-xs rounded"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="h-32 bg-muted flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <ImageIcon size={20} />
                    <span className="text-xs">No image selected</span>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleFileChange}
                  aria-label="Upload image"
                />

                <Button
                  data-ocid="admin.product.image.upload_button"
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isUploading || !isLoggedIn}
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full rounded-none border-border text-xs tracking-widest uppercase font-medium h-10 gap-2"
                >
                  {isUploading ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />
                      Uploading {uploadProgress}%
                    </>
                  ) : (
                    <>
                      <Upload size={13} />
                      {imagePreview ? "Change Image" : "Upload Image"}
                    </>
                  )}
                </Button>

                {!isLoggedIn && (
                  <p className="text-xs text-muted-foreground text-center">
                    Log in to upload images
                  </p>
                )}
              </div>
            </div>

            <DialogFooter className="gap-2 pt-2">
              <Button
                data-ocid="admin.product.form.cancel_button"
                type="button"
                variant="outline"
                onClick={() => setFormOpen(false)}
                className="rounded-none border-border text-xs tracking-widest uppercase font-medium h-11 flex-1"
              >
                Cancel
              </Button>
              <Button
                data-ocid="admin.product.form.submit_button"
                type="submit"
                disabled={
                  addProduct.isPending || updateProduct.isPending || isUploading
                }
                className="rounded-none bg-foreground text-background hover:bg-foreground/90 text-xs tracking-widest uppercase font-medium h-11 flex-1 gap-2"
              >
                {addProduct.isPending || updateProduct.isPending ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : null}
                {editingProduct ? "Save Changes" : "Add Product"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
      >
        <AlertDialogContent
          data-ocid="admin.delete.dialog"
          className="rounded-none border-border bg-background"
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-xl font-light text-foreground">
              Remove Product
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground text-sm">
              Are you sure you want to remove{" "}
              <strong className="text-foreground">{deleteTarget?.name}</strong>?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel
              data-ocid="admin.delete.cancel_button"
              className="rounded-none border-border text-xs tracking-widest uppercase font-medium h-11"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="admin.delete.confirm_button"
              onClick={handleDelete}
              disabled={removeProduct.isPending}
              className="rounded-none bg-destructive text-destructive-foreground hover:bg-destructive/90 text-xs tracking-widest uppercase font-medium h-11 gap-2"
            >
              {removeProduct.isPending ? (
                <Loader2 size={14} className="animate-spin" />
              ) : null}
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
