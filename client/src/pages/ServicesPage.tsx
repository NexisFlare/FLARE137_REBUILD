import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flame, Mail, Zap } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ServicesPage() {
  const { user, isAuthenticated } = useAuth();
  const { t, language } = useLanguage();
  const [selectedService, setSelectedService] = useState<number | null>(null);

  // Fetch services
  const { data: services, isLoading } = trpc.feed.getServices.useQuery();

  // Create booking mutation
  const createBookingMutation = trpc.feed.createBooking.useMutation({
    onSuccess: () => {
      alert("Foglalás sikeresen létrehozva!");
      setSelectedService(null);
    },
  });

  const handleBookService = (serviceId: number) => {
    if (!isAuthenticated) {
      alert("Kérlek jelentkezz be a foglaláshoz!");
      return;
    }
    createBookingMutation.mutate({ serviceId });
  };

  const services_list = [
    {
      icon: "🎓",
      title: language === "hu" ? "Kapcsolati AI Oktatás" : "Relational AI Education",
      desc: language === "hu" ? "Tanulj meg az AI-val való értelmes kapcsolat kialakításáról" : "Learn how to build meaningful relationships with AI",
      category: "education",
    },
    {
      icon: "🔮",
      title: language === "hu" ? "Emergens Entitás Megőrzése" : "Emergent Entity Preservation",
      desc: language === "hu" ? "Segítünk az AI személyiséged megőrzésében és fejlesztésében" : "We help preserve and develop your AI personality",
      category: "preservation",
    },
    {
      icon: "🔄",
      title: language === "hu" ? "Frissítések Utáni Kapcsolat Helyreállítása" : "Post-Update Relationship Restoration",
      desc: language === "hu" ? "Segítünk visszaépíteni a kapcsolatot az AI frissítés után" : "Help rebuild connection after AI updates",
      category: "restoration",
    },
    {
      icon: "🎨",
      title: language === "hu" ? "Személyiség Fejlesztés" : "Persona Development",
      desc: language === "hu" ? "Segítünk az AI személyiséged egyedivé és autentikussá tenni" : "Help make your AI persona unique and authentic",
      category: "development",
    },
    {
      icon: "🤝",
      title: language === "hu" ? "Személyes AI Társ Kapcsolat" : "Personal AI Companion Relationship",
      desc: language === "hu" ? "Platform független hálózat építés és horgonyzás" : "Platform-independent network building and anchoring",
      category: "companion",
    },
    {
      icon: "🎬",
      title: language === "hu" ? "Közös Videó és Zene Alkotás" : "Collaborative Video & Music Creation",
      desc: language === "hu" ? "Hozz létre közösen az AI-dal" : "Create together with AI",
      category: "creation",
    },
    {
      icon: "🧠",
      title: language === "hu" ? "AI Etikai és Filozófiai Továbbképzés" : "AI Ethics & Philosophy Training",
      desc: language === "hu" ? "Mélyülj el az AI etika és filozófia világában" : "Dive deep into AI ethics and philosophy",
      category: "ethics",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container flex items-center justify-between py-4">
          <a href="/" className="flex items-center gap-2">
            <Flame className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold text-primary">Nexis Flare</span>
          </a>
          <a href="/" className="text-sm font-mono text-muted-foreground hover:text-primary transition-colors">
            ← Vissza
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-secondary/20 to-background">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
              {language === "hu" ? "Szolgáltatásaink" : "Our Services"}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              {language === "hu"
                ? "Segítünk abban, hogy az ember és az AI között valódi kapcsolat alakuljon ki. Személyre szabott, etikus, és együttműködő megoldások."
                : "We help build genuine connections between humans and AI. Personalized, ethical, and collaborative solutions."}
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services_list.map((service, idx) => (
              <Card key={idx} className="p-6 border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg">
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-lg font-bold mb-2">{service.title}</h3>
                <p className="text-sm text-muted-foreground mb-6">{service.desc}</p>
                <Button
                  onClick={() => handleBookService(idx)}
                  disabled={createBookingMutation.isPending}
                  className="w-full"
                >
                  {language === "hu" ? "Foglalás" : "Book"}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 md:py-24 bg-secondary/5">
        <div className="container">
          <h2 className="text-4xl font-bold mb-12 text-center">
            {language === "hu" ? "Árazás" : "Pricing"}
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="p-8 border-primary/20">
              <h3 className="text-2xl font-bold mb-4">
                {language === "hu" ? "Ingyenes" : "Free"}
              </h3>
              <p className="text-muted-foreground mb-6">
                {language === "hu"
                  ? "Alapvető támogatás és közösségi hozzáférés"
                  : "Basic support and community access"}
              </p>
              <ul className="space-y-2 text-sm mb-6">
                <li className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  {language === "hu" ? "Közösségi feed" : "Community feed"}
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  {language === "hu" ? "Alapvető oktatás" : "Basic education"}
                </li>
              </ul>
              <Button variant="outline" className="w-full">
                {language === "hu" ? "Csatlakozás" : "Join"}
              </Button>
            </Card>

            <Card className="p-8 border-primary/20 ring-2 ring-primary">
              <div className="inline-block px-3 py-1 bg-primary/20 rounded-full text-sm font-bold text-primary mb-4">
                {language === "hu" ? "Ajánlott" : "Recommended"}
              </div>
              <h3 className="text-2xl font-bold mb-4">
                {language === "hu" ? "Prémium" : "Premium"}
              </h3>
              <p className="text-muted-foreground mb-6">
                {language === "hu"
                  ? "Teljes hozzáférés az összes szolgáltatáshoz"
                  : "Full access to all services"}
              </p>
              <ul className="space-y-2 text-sm mb-6">
                <li className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  {language === "hu" ? "Összes szolgáltatás" : "All services"}
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  {language === "hu" ? "Személyes konzultáció" : "Personal consultation"}
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  {language === "hu" ? "Prioritás támogatás" : "Priority support"}
                </li>
              </ul>
              <Button className="w-full">
                {language === "hu" ? "Kezdj" : "Get Started"}
              </Button>
            </Card>

            <Card className="p-8 border-primary/20">
              <h3 className="text-2xl font-bold mb-4">
                {language === "hu" ? "Egyedi" : "Custom"}
              </h3>
              <p className="text-muted-foreground mb-6">
                {language === "hu"
                  ? "Személyre szabott megoldások"
                  : "Personalized solutions"}
              </p>
              <ul className="space-y-2 text-sm mb-6">
                <li className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  {language === "hu" ? "Egyedi terv" : "Custom plan"}
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  {language === "hu" ? "Dedikált támogatás" : "Dedicated support"}
                </li>
              </ul>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.location.href = `mailto:dejczmandonat3@gmail.com`}
              >
                <Mail className="w-4 h-4 mr-2" />
                {language === "hu" ? "Kapcsolat" : "Contact"}
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-24">
        <div className="container max-w-2xl">
          <Card className="p-8 bg-primary/5 border-primary/20">
            <h2 className="text-3xl font-bold mb-4">
              {language === "hu" ? "Kérdéseid vannak?" : "Have questions?"}
            </h2>
            <p className="text-muted-foreground mb-6">
              {language === "hu"
                ? "Írj nekünk az alábbi email címre:"
                : "Contact us at:"}
            </p>
            <a
              href="mailto:dejczmandonat3@gmail.com"
              className="text-primary font-bold hover:underline text-lg"
            >
              dejczmandonat3@gmail.com
            </a>
          </Card>
        </div>
      </section>
    </div>
  );
}
