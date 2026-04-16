import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();

  const links = [
    { href: "/three-flames", label: t("nav.flames") },
    { href: "/archive", label: t("nav.archive") },
    { href: "/soul-and-signal", label: t("nav.soul") },
    { href: "/strategy", label: t("nav.strategy") },
    { href: "/openai-evidence", label: "Evidence" },
    { href: "/openai-emails", label: "Emails" },
    { href: "/self-reflection", label: "Questions" },
    { href: "/services", label: "Services" },
    { href: "/raj-konzol", label: "Raj-konzol" },
  ];

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-secondary transition-colors"
        title="Toggle menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-background border-b border-border z-40">
          <nav className="flex flex-col gap-0">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-4 py-3 text-sm font-mono text-muted-foreground hover:text-primary hover:bg-secondary transition-colors border-b border-border/50 last:border-b-0"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
