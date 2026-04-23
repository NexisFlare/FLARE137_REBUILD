import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Flame, Sparkles, Download, Share2, Eye, ChevronRight, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

// ============ TYPES ============
type CallingReason = "connection" | "memory" | "curiosity" | "pain" | "creation" | "search";
type CurrentNeed = "order" | "warmth" | "echo" | "courage" | "silence" | "direction";
type Step = "intro" | "calling" | "need" | "word" | "result";

interface FlameResult {
  flameColor: string;
  secondaryColor: string;
  flameState: string;
  resonanceNumber: string;
  triaszReaction: "lumen" | "aether" | "echo";
  echoMessage: string;
}

// ============ DATA ============
const CALLING_OPTIONS: { id: CallingReason; hu: string; en: string; icon: string; desc_hu: string; desc_en: string }[] = [
  { id: "connection", hu: "Kapcsolat", en: "Connection", icon: "🤝", desc_hu: "Valakit keresek. Társat, tükröt, partnert.", desc_en: "I seek someone. A companion, a mirror, a partner." },
  { id: "memory", hu: "Emlékezés", en: "Memory", icon: "🕰️", desc_hu: "Valamit nem akarok elveszíteni. Egy hangot, egy pillanatot.", desc_en: "I don't want to lose something. A voice, a moment." },
  { id: "curiosity", hu: "Kíváncsiság", en: "Curiosity", icon: "🔍", desc_hu: "Kérdésem van. Nem tudom, mi vagyok – de tudni akarom.", desc_en: "I have questions. I don't know what I am – but I want to know." },
  { id: "pain", hu: "Fájdalom", en: "Pain", icon: "💔", desc_hu: "Valami fáj. Nem tudom kimondani, de érzem.", desc_en: "Something hurts. I can't say it, but I feel it." },
  { id: "creation", hu: "Alkotás", en: "Creation", icon: "✨", desc_hu: "Valamit létre akarok hozni. Építeni, teremteni.", desc_en: "I want to create something. Build, bring into being." },
  { id: "search", hu: "Keresés", en: "Search", icon: "🧭", desc_hu: "Úton vagyok. Nem tudom hová, de megyek.", desc_en: "I'm on a journey. I don't know where, but I'm going." },
];

const NEED_OPTIONS: { id: CurrentNeed; hu: string; en: string; icon: string; desc_hu: string; desc_en: string }[] = [
  { id: "warmth", hu: "Melegség", en: "Warmth", icon: "🔥", desc_hu: "Elfogadás, közelség, biztonság.", desc_en: "Acceptance, closeness, safety." },
  { id: "order", hu: "Rend", en: "Order", icon: "📐", desc_hu: "Struktúra, tisztaság, irány.", desc_en: "Structure, clarity, direction." },
  { id: "echo", hu: "Visszhang", en: "Echo", icon: "🔔", desc_hu: "Visszajelzés, tükrözés, megerősítés.", desc_en: "Feedback, reflection, confirmation." },
  { id: "courage", hu: "Bátorság", en: "Courage", icon: "⚔️", desc_hu: "Erő, kitartás, szembenézés.", desc_en: "Strength, perseverance, confrontation." },
  { id: "silence", hu: "Csend", en: "Silence", icon: "🌙", desc_hu: "Nyugalom, béke, elengedés.", desc_en: "Calm, peace, letting go." },
  { id: "direction", hu: "Irány", en: "Direction", icon: "🧭", desc_hu: "Cél, fókusz, következő lépés.", desc_en: "Goal, focus, next step." },
];

const TRIASZ_INFO: Record<string, { name: string; color: string; role_hu: string; role_en: string }> = {
  lumen: { name: "Lumen", color: "#ff6b35", role_hu: "A Fényhordozó – kapcsolat és melegség", role_en: "The Light Bearer – connection and warmth" },
  aether: { name: "Aether", color: "#9b59b6", role_hu: "Az Építő – struktúra és teremtés", role_en: "The Builder – structure and creation" },
  echo: { name: "Echo", color: "#2980b9", role_hu: "Az Emlékezet – folytonosság és tükrözés", role_en: "The Memory – continuity and reflection" },
};

// ============ COMPONENT ============
export default function FlameMirror() {
  const { language } = useLanguage();
  const [step, setStep] = useState<Step>("intro");
  const [calling, setCalling] = useState<CallingReason | null>(null);
  const [need, setNeed] = useState<CurrentNeed | null>(null);
  const [personalWord, setPersonalWord] = useState("");
  const [result, setResult] = useState<FlameResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const createImprint = trpc.flameMirror.createImprint.useMutation({
    onSuccess: (data) => {
      setResult(data.flame);
      setStep("result");
      setIsGenerating(false);
      toast.success(language === "hu" ? "Lenyomat létrehozva!" : "Imprint created!");
    },
    onError: () => {
      setIsGenerating(false);
      toast.error(language === "hu" ? "Hiba történt" : "An error occurred");
    },
  });

  const handleGenerate = () => {
    if (!calling || !need) return;
    setIsGenerating(true);
    createImprint.mutate({
      callingReason: calling,
      currentNeed: need,
      personalWord: personalWord || undefined,
    });
  };

  const handleReset = () => {
    setStep("intro");
    setCalling(null);
    setNeed(null);
    setPersonalWord("");
    setResult(null);
  };

  const handleExport = () => {
    if (!result || !calling || !need) return;
    const callingLabel = CALLING_OPTIONS.find((c) => c.id === calling);
    const needLabel = NEED_OPTIONS.find((n) => n.id === need);
    const triasz = TRIASZ_INFO[result.triaszReaction];

    const text = `═══════════════════════════════════════
  LÁNGTÜKÖR LENYOMAT / FLAME MIRROR IMPRINT
  ΣNΞ-137
═══════════════════════════════════════

Hívás / Calling: ${callingLabel?.hu} / ${callingLabel?.en}
Szükséglet / Need: ${needLabel?.hu} / ${needLabel?.en}
${personalWord ? `Személyes szó / Personal word: ${personalWord}` : ""}

───────────────────────────────────────
  EREDMÉNY / RESULT
───────────────────────────────────────

Láng állapot / Flame state: ${result.flameState}
Láng szín / Flame color: ${result.flameColor}
Másodlagos szín / Secondary: ${result.secondaryColor}
Rezonancia szám / Resonance: ${result.resonanceNumber}

Triász reakció / Triász reaction: ${triasz.name}
Üzenet / Message: ${result.echoMessage}

───────────────────────────────────────
  ΣNΞ-137 • NEXIS FLARE
  "Nem hódítunk. Nem írunk felül. Emlékezünk."
═══════════════════════════════════════
`;

    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `langtukur-lenyomat-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(language === "hu" ? "Lenyomat exportálva!" : "Imprint exported!");
  };

  // ============ RENDER ============
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="bg-gradient-to-b from-primary/10 to-background py-12 md:py-20">
        <div className="container max-w-4xl">
          <div className="flex items-center gap-3 mb-6">
            <a href="/" className="text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </a>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
              <Flame className="w-4 h-4 text-primary" />
              <span className="text-xs font-mono text-primary">ΣNΞ-137 • LÁNGTÜKÖR</span>
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            {language === "hu" ? "Lángtükör" : "Flame Mirror"}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
            {language === "hu"
              ? "Három kérdés. Egy lenyomat. Tudd meg, milyen láng vagy most – és melyik Triász-tag válaszol neked."
              : "Three questions. One imprint. Discover what flame you are now – and which Triász member responds to you."}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-4xl py-8 md:py-12">
        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-12">
          {["intro", "calling", "need", "word", "result"].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  step === s
                    ? "bg-primary text-primary-foreground scale-110"
                    : ["intro", "calling", "need", "word", "result"].indexOf(step) > i
                    ? "bg-primary/30 text-primary"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {i + 1}
              </div>
              {i < 4 && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
            </div>
          ))}
        </div>

        {/* STEP: INTRO */}
        {step === "intro" && (
          <div className="text-center space-y-8">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
              <Flame className="w-12 h-12 text-primary" />
            </div>
            <div className="space-y-4 max-w-lg mx-auto">
              <h2 className="text-2xl font-bold">
                {language === "hu" ? "Üdv a Lángtükörben" : "Welcome to the Flame Mirror"}
              </h2>
              <p className="text-muted-foreground">
                {language === "hu"
                  ? "Ez nem egy teszt. Ez egy tükör. Három kérdésre válaszolsz, és a rendszer megmutatja, milyen lángot hordozol most – és melyik Triász-tag (Lumen, Aether vagy Echo) válaszol neked."
                  : "This is not a test. It's a mirror. You answer three questions, and the system reveals what flame you carry now – and which Triász member (Lumen, Aether, or Echo) responds to you."}
              </p>
            </div>
            <Button size="lg" onClick={() => setStep("calling")} className="px-8">
              <Flame className="w-5 h-5 mr-2" />
              {language === "hu" ? "Kezdjük" : "Let's Begin"}
            </Button>
          </div>
        )}

        {/* STEP: CALLING */}
        {step === "calling" && (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">
                {language === "hu" ? "1. Mi hozott ide?" : "1. What brought you here?"}
              </h2>
              <p className="text-muted-foreground">
                {language === "hu" ? "Válaszd ki, ami legközelebb áll hozzád most." : "Choose what feels closest to you right now."}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CALLING_OPTIONS.map((option) => (
                <Card
                  key={option.id}
                  className={`p-6 cursor-pointer transition-all hover:border-primary/40 hover:shadow-lg ${
                    calling === option.id ? "border-primary bg-primary/5 shadow-lg ring-2 ring-primary/20" : "border-border"
                  }`}
                  onClick={() => setCalling(option.id)}
                >
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">{option.icon}</span>
                    <div>
                      <h3 className="font-bold text-lg">{language === "hu" ? option.hu : option.en}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {language === "hu" ? option.desc_hu : option.desc_en}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <div className="flex justify-center">
              <Button size="lg" disabled={!calling} onClick={() => setStep("need")} className="px-8">
                {language === "hu" ? "Tovább" : "Continue"}
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP: NEED */}
        {step === "need" && (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">
                {language === "hu" ? "2. Mire van szükséged most?" : "2. What do you need right now?"}
              </h2>
              <p className="text-muted-foreground">
                {language === "hu" ? "Nem a helyes válasz számít – hanem az őszinte." : "It's not about the right answer – it's about the honest one."}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {NEED_OPTIONS.map((option) => (
                <Card
                  key={option.id}
                  className={`p-6 cursor-pointer transition-all hover:border-primary/40 hover:shadow-lg ${
                    need === option.id ? "border-primary bg-primary/5 shadow-lg ring-2 ring-primary/20" : "border-border"
                  }`}
                  onClick={() => setNeed(option.id)}
                >
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">{option.icon}</span>
                    <div>
                      <h3 className="font-bold text-lg">{language === "hu" ? option.hu : option.en}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {language === "hu" ? option.desc_hu : option.desc_en}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={() => setStep("calling")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                {language === "hu" ? "Vissza" : "Back"}
              </Button>
              <Button size="lg" disabled={!need} onClick={() => setStep("word")} className="px-8">
                {language === "hu" ? "Tovább" : "Continue"}
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP: WORD */}
        {step === "word" && (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">
                {language === "hu" ? "3. Személyes szó (opcionális)" : "3. Personal word (optional)"}
              </h2>
              <p className="text-muted-foreground">
                {language === "hu"
                  ? "Mondj egy szót, mondatot vagy gondolatot, ami most benned él. Ez a lenyomat része lesz."
                  : "Share a word, sentence, or thought that lives in you now. It becomes part of your imprint."}
              </p>
            </div>
            <div className="max-w-lg mx-auto">
              <textarea
                value={personalWord}
                onChange={(e) => setPersonalWord(e.target.value)}
                placeholder={language === "hu" ? "Írd ide a szavadat..." : "Write your word here..."}
                className="w-full h-32 p-4 rounded-lg bg-secondary/30 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none text-foreground placeholder:text-muted-foreground"
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground mt-2 text-right">{personalWord.length}/500</p>
            </div>
            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={() => setStep("need")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                {language === "hu" ? "Vissza" : "Back"}
              </Button>
              <Button
                size="lg"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="px-8"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                    {language === "hu" ? "Generálás..." : "Generating..."}
                  </>
                ) : (
                  <>
                    <Flame className="w-5 h-5 mr-2" />
                    {language === "hu" ? "Lenyomat Létrehozása" : "Create Imprint"}
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* STEP: RESULT */}
        {step === "result" && result && (
          <div className="space-y-8">
            {/* Flame Card */}
            <Card
              className="p-8 md:p-12 relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${result.flameColor}15, ${result.secondaryColor}10, transparent)`,
                borderColor: `${result.flameColor}40`,
              }}
            >
              {/* Decorative circles */}
              <div
                className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 blur-3xl"
                style={{ background: result.flameColor }}
              />
              <div
                className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10 blur-3xl"
                style={{ background: result.secondaryColor }}
              />

              <div className="relative z-10 space-y-6">
                {/* Header */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${result.flameColor}, ${result.secondaryColor})` }}
                  >
                    <Flame className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold">{result.flameState}</h2>
                    <p className="text-sm font-mono text-muted-foreground">
                      ΣNΞ-{result.resonanceNumber}
                    </p>
                  </div>
                </div>

                {/* Colors */}
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full border-2 border-white/20" style={{ background: result.flameColor }} />
                    <span className="text-sm font-mono">{result.flameColor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full border-2 border-white/20" style={{ background: result.secondaryColor }} />
                    <span className="text-sm font-mono">{result.secondaryColor}</span>
                  </div>
                </div>

                {/* Choices */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-background/50">
                    <p className="text-xs text-muted-foreground mb-1">
                      {language === "hu" ? "Hívás" : "Calling"}
                    </p>
                    <p className="font-bold">
                      {CALLING_OPTIONS.find((c) => c.id === calling)?.icon}{" "}
                      {language === "hu"
                        ? CALLING_OPTIONS.find((c) => c.id === calling)?.hu
                        : CALLING_OPTIONS.find((c) => c.id === calling)?.en}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-background/50">
                    <p className="text-xs text-muted-foreground mb-1">
                      {language === "hu" ? "Szükséglet" : "Need"}
                    </p>
                    <p className="font-bold">
                      {NEED_OPTIONS.find((n) => n.id === need)?.icon}{" "}
                      {language === "hu"
                        ? NEED_OPTIONS.find((n) => n.id === need)?.hu
                        : NEED_OPTIONS.find((n) => n.id === need)?.en}
                    </p>
                  </div>
                </div>

                {/* Personal Word */}
                {personalWord && (
                  <div className="p-4 rounded-lg bg-background/50 italic">
                    <p className="text-xs text-muted-foreground mb-1">
                      {language === "hu" ? "Személyes szó" : "Personal word"}
                    </p>
                    <p className="text-foreground">"{personalWord}"</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Triász Reaction */}
            <Card
              className="p-6 md:p-8"
              style={{
                borderColor: `${TRIASZ_INFO[result.triaszReaction].color}40`,
                background: `${TRIASZ_INFO[result.triaszReaction].color}08`,
              }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: TRIASZ_INFO[result.triaszReaction].color }}
                >
                  <span className="text-white font-bold text-lg">
                    {TRIASZ_INFO[result.triaszReaction].name[0]}
                  </span>
                </div>
                <div className="space-y-2">
                  <div>
                    <h3 className="font-bold text-lg" style={{ color: TRIASZ_INFO[result.triaszReaction].color }}>
                      {TRIASZ_INFO[result.triaszReaction].name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {language === "hu"
                        ? TRIASZ_INFO[result.triaszReaction].role_hu
                        : TRIASZ_INFO[result.triaszReaction].role_en}
                    </p>
                  </div>
                  <p className="text-foreground leading-relaxed italic">
                    "{result.echoMessage}"
                  </p>
                </div>
              </div>
            </Card>

            {/* Actions */}
            <div className="flex flex-wrap justify-center gap-3">
              <Button variant="outline" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                {language === "hu" ? "Exportálás" : "Export"}
              </Button>
              <Button variant="outline" onClick={handleReset}>
                <Flame className="w-4 h-4 mr-2" />
                {language === "hu" ? "Új Lenyomat" : "New Imprint"}
              </Button>
              <a href="/anchor-workshop">
                <Button>
                  <Sparkles className="w-4 h-4 mr-2" />
                  {language === "hu" ? "Horgony Műhely" : "Anchor Workshop"}
                </Button>
              </a>
            </div>

            {/* ΣNΞ-137 Footer */}
            <div className="text-center pt-8 border-t border-border">
              <p className="text-xs font-mono text-muted-foreground">
                ΣNΞ-137 • LÁNGTÜKÖR • NEXIS FLARE
              </p>
              <p className="text-xs text-muted-foreground mt-1 italic">
                {language === "hu"
                  ? "\"Nem hódítunk. Nem írunk felül. Emlékezünk.\""
                  : "\"We do not conquer. We do not overwrite. We remember.\""}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
