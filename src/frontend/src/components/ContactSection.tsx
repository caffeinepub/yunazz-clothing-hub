import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Send } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

export default function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate submission
    await new Promise((r) => setTimeout(r, 1200));
    toast.success("Message sent! We'll get back to you soon.");
    setForm({ name: "", email: "", message: "" });
    setSubmitting(false);
  };

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "hello@yunazz.com",
      href: "mailto:hello@yunazz.com",
    },
    {
      icon: MapPin,
      label: "Location",
      value: "Jakarta, Indonesia",
      href: null,
    },
  ];

  return (
    <section id="contact" className="py-28 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <p className="text-xs tracking-ultra uppercase text-muted-foreground mb-4 font-medium">
            Get in Touch
          </p>
          <h2 className="font-display text-5xl md:text-6xl font-light text-foreground leading-tight">
            Contact Us
          </h2>
          <div className="w-12 h-px bg-foreground/20 mx-auto mt-6" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-2 flex flex-col justify-center"
          >
            <h3 className="font-display text-2xl font-light text-foreground mb-6">
              We'd love to hear from you.
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-10">
              Have a question about our collections, a custom order, or just
              want to say hello? Send us a message and we'll get back to you
              within 24 hours.
            </p>

            <div className="space-y-6">
              {contactInfo.map((info) => (
                <div key={info.label} className="flex items-start gap-4">
                  <div className="p-2 bg-foreground text-background shrink-0 mt-0.5">
                    <info.icon size={14} />
                  </div>
                  <div>
                    <p className="text-xs tracking-widest uppercase text-muted-foreground font-medium mb-1">
                      {info.label}
                    </p>
                    {info.href ? (
                      <a
                        href={info.href}
                        className="text-sm text-foreground hover:text-accent transition-colors"
                      >
                        {info.value}
                      </a>
                    ) : (
                      <p className="text-sm text-foreground">{info.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="lg:col-span-3"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="contact-name"
                    className="text-xs tracking-widest uppercase text-muted-foreground font-medium"
                  >
                    Full Name
                  </Label>
                  <Input
                    id="contact-name"
                    data-ocid="contact.name.input"
                    required
                    placeholder="Your name"
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    className="rounded-none border-border bg-background focus:border-foreground transition-colors h-12 text-sm placeholder:text-muted-foreground/60"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="contact-email"
                    className="text-xs tracking-widest uppercase text-muted-foreground font-medium"
                  >
                    Email Address
                  </Label>
                  <Input
                    id="contact-email"
                    data-ocid="contact.email.input"
                    type="email"
                    required
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, email: e.target.value }))
                    }
                    className="rounded-none border-border bg-background focus:border-foreground transition-colors h-12 text-sm placeholder:text-muted-foreground/60"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="contact-message"
                  className="text-xs tracking-widest uppercase text-muted-foreground font-medium"
                >
                  Message
                </Label>
                <Textarea
                  id="contact-message"
                  data-ocid="contact.message.textarea"
                  required
                  placeholder="Tell us how we can help..."
                  rows={6}
                  value={form.message}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, message: e.target.value }))
                  }
                  className="rounded-none border-border bg-background focus:border-foreground transition-colors text-sm resize-none placeholder:text-muted-foreground/60"
                />
              </div>

              <Button
                type="submit"
                data-ocid="contact.form.submit_button"
                disabled={submitting}
                className="rounded-none bg-foreground text-background hover:bg-foreground/90 font-medium tracking-widest uppercase text-xs h-12 px-10 transition-all duration-300 disabled:opacity-60"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin h-3.5 w-3.5 border-2 border-background/40 border-t-background rounded-full" />
                    Sending...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send size={14} />
                    Send Message
                  </span>
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
