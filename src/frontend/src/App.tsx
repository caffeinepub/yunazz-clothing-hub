import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";
import AboutSection from "./components/AboutSection";
import AdminPanel from "./components/AdminPanel";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";
import Navbar from "./components/Navbar";
import ShopSection from "./components/ShopSection";
import { useIsAdmin } from "./hooks/useQueries";

export default function App() {
  const [showAdmin, setShowAdmin] = useState(false);
  const { data: isAdmin } = useIsAdmin();

  // Check if URL has /admin hash or path
  useEffect(() => {
    const checkAdmin = () => {
      if (
        window.location.hash === "#admin" ||
        window.location.pathname === "/admin"
      ) {
        setShowAdmin(true);
      }
    };
    checkAdmin();
    window.addEventListener("hashchange", checkAdmin);
    return () => window.removeEventListener("hashchange", checkAdmin);
  }, []);

  if (showAdmin) {
    return (
      <>
        <AdminPanel
          onClose={() => {
            setShowAdmin(false);
            window.history.pushState(null, "", "/");
          }}
        />
        <Toaster position="top-right" />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        isAdmin={!!isAdmin}
        onAdminClick={() => {
          setShowAdmin(true);
          window.history.pushState(null, "", "/admin");
        }}
      />
      <main>
        <HeroSection />
        <ShopSection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
      <Toaster position="top-right" />
    </div>
  );
}
