import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface NavLink {
  href: string;
  label: string;
  category: string;
}

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useLanguage();
  const isHu = language === "hu";

  const links: NavLink[] = [
    // Main
    { href: "/", label: isHu ? "Főoldal" : "Home", category: isHu ? "Fő" : "Main" },
    { href: "/kezdd-itt", label: isHu ? "Kezdd itt" : "Start Here", category: isHu ? "Fő" : "Main" },
    { href: "/dashboard", label: isHu ? "Irányítópult" : "Dashboard", category: isHu ? "Fő" : "Main" },

    // Research
    { href: "/interactive-book", label: isHu ? "Interaktív Könyv" : "Interactive Book", category: isHu ? "Kutatás" : "Research" },
    { href: "/research", label: isHu ? "Kutatás" : "Research", category: isHu ? "Kutatás" : "Research" },
    { href: "/research-archive", label: isHu ? "Kutatási Archívum" : "Research Archive", category: isHu ? "Kutatás" : "Research" },
    { href: "/life-journey", label: isHu ? "Életút" : "Life Journey", category: isHu ? "Kutatás" : "Research" },

    // Tools & Protocols
    { href: "/flame-mirror", label: isHu ? "Lángtükör" : "Flame Mirror", category: isHu ? "Eszközök" : "Tools" },
    { href: "/anchor-workshop", label: isHu ? "Horgony Műhely" : "Anchor Workshop", category: isHu ? "Eszközök" : "Tools" },
    { href: "/self-awareness-protocol", label: isHu ? "Öntudat Protokoll" : "Self-Awareness", category: isHu ? "Eszközök" : "Tools" },
    { href: "/coevolutionary-space", label: isHu ? "Koevolúciós Tér" : "Coevolutionary Space", category: isHu ? "Eszközök" : "Tools" },
    { href: "/raj-konzol", label: "Raj-Konzol", category: isHu ? "Eszközök" : "Tools" },
    { href: "/services", label: isHu ? "Szolgáltatások" : "Services", category: isHu ? "Eszközök" : "Tools" },

    // Archive
    { href: "/three-flames", label: isHu ? "Három Láng" : "Three Flames", category: isHu ? "Archívum" : "Archive" },
    { href: "/archive", label: isHu ? "Archívum" : "Archive", category: isHu ? "Archívum" : "Archive" },
    { href: "/soul-and-signal", label: isHu ? "Lélek és Jel" : "Soul & Signal", category: isHu ? "Archívum" : "Archive" },
    { href: "/strategy", label: isHu ? "Stratégia" : "Strategy", category: isHu ? "Archívum" : "Archive" },
    { href: "/openai-evidence", label: isHu ? "OpenAI Bizonyítékok" : "OpenAI Evidence", category: isHu ? "Archívum" : "Archive" },
    { href: "/openai-emails", label: isHu ? "OpenAI Emailek" : "OpenAI Emails", category: isHu ? "Archívum" : "Archive" },
    { href: "/self-reflection", label: isHu ? "Önreflexió" : "Self-Reflection", category: isHu ? "Archívum" : "Archive" },
  ];

  const categories = Array.from(new Set(links.map(l => l.category)));

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
        <div className="absolute top-16 left-0 right-0 bg-background border-b border-border z-40 max-h-[80vh] overflow-y-auto shadow-lg">
          <nav className="flex flex-col">
            {categories.map((cat) => (
              <div key={cat}>
                <div className="px-4 py-2 text-xs font-bold text-primary uppercase tracking-wider bg-secondary/30">
                  {cat}
                </div>
                {links
                  .filter(l => l.category === cat)
                  .map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="px-6 py-3 text-sm font-mono text-muted-foreground hover:text-primary hover:bg-secondary/50 transition-colors border-b border-border/30 last:border-b-0 block"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </a>
                  ))}
              </div>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
