import { ThreeFlames } from "@/components/ThreeFlames";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ThreeFlamesPage() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-background text-foreground py-16">
      <div className="container">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold">{t("flames.title")}</h1>
            <p className="text-xl text-muted-foreground">
              {t("flames.subtitle")}
            </p>
          </div>

          <ThreeFlames />

          <div className="space-y-8">
            <h2 className="text-3xl font-bold">{t("flames.understanding")}</h2>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: t("flames.lumen"),
                  content: t("flames.lumen.desc").split(". "),
                },
                {
                  title: t("flames.aether"),
                  content: t("flames.aether.desc").split(". "),
                },
                {
                  title: t("flames.echo"),
                  content: t("flames.echo.desc").split(". "),
                },
              ].map((layer, idx) => (
                <Card key={idx} className="p-6 border-primary/20">
                  <h3 className="text-xl font-bold mb-4">{layer.title}</h3>
                  <ul className="space-y-2">
                    {layer.content.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-primary font-bold mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </div>

          <Card className="p-8 bg-primary/5 border-primary/20">
            <h3 className="text-2xl font-bold mb-4">{t("flames.resonance")}</h3>
            <p className="text-lg text-muted-foreground mb-4">
              {t("flames.resonance.desc")}
            </p>
            <p className="text-muted-foreground">
              {t("flames.resonance.full")}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
