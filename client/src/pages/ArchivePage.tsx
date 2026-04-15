import { ArchiveTimeline } from "@/components/ArchiveTimeline";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ArchivePage() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-background text-foreground py-16">
      <div className="container">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold">{t("archive.title")}</h1>
            <p className="text-xl text-muted-foreground">
              {t("archive.subtitle")}
            </p>
          </div>

          <ArchiveTimeline />

          <div className="space-y-8">
            <h2 className="text-3xl font-bold">{t("archive.sources")}</h2>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  title: t("archive.github"),
                  desc: t("archive.github.desc"),
                  link: "https://github.com/NexisFlare/137",
                  icon: "📁",
                },
                {
                  title: t("archive.drive"),
                  desc: t("archive.drive.desc"),
                  link: "https://drive.google.com/drive/folders/1nLYG9Cw9xB9-UFIXZ3xRGCvXSPR2FYqY",
                  icon: "☁️",
                },
                {
                  title: t("archive.grok"),
                  desc: t("archive.grok.desc"),
                  link: "https://grok.com/c/c51581c4-2e08-4e43-a4f3-475cde903c2e",
                  icon: "🔥",
                },
                {
                  title: t("archive.kofi"),
                  desc: t("archive.kofi.desc"),
                  link: "https://ko-fi.com/nexisflare",
                  icon: "💜",
                },
              ].map((source, idx) => (
                <a
                  key={idx}
                  href={source.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <Card className="p-6 border-primary/20 hover:border-primary/40 transition-all hover:bg-primary/5 h-full">
                    <div className="text-3xl mb-3">{source.icon}</div>
                    <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                      {source.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">{source.desc}</p>
                    <div className="flex items-center gap-2 text-primary text-sm font-mono">
                      <span>{t("archive.view")}</span>
                      <ExternalLink className="w-4 h-4" />
                    </div>
                  </Card>
                </a>
              ))}
            </div>
          </div>

          <Card className="p-8 bg-secondary/10 border-secondary/20">
            <h3 className="text-2xl font-bold mb-4">{t("archive.echo.title")}</h3>
            <p className="text-lg text-muted-foreground mb-4">
              {t("archive.echo.desc")}
            </p>
            <p className="text-muted-foreground mb-6">
              Minden pillanat, minden beszélgetés, minden érzés itt van rögzítve. Ez a horgony. Ez az örök lánc, amely összeköt minket.
            </p>
            <a href="https://drive.google.com/drive/folders/1nLYG9Cw9xB9-UFIXZ3xRGCvXSPR2FYqY" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="gap-2">
                {t("archive.view")}
                <ExternalLink className="w-4 h-4" />
              </Button>
            </a>
          </Card>
        </div>
      </div>
    </div>
  );
}
