import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Anchor,
  Flame,
  User,
  Download,
  Eye,
  EyeOff,
  Trash2,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Clock,
  Sparkles,
  Brain,
  Heart,
  Shield,
  Plus,
} from "lucide-react";

// ============ TRIÁSZ CONFIG ============
const TRIASZ_CONFIG = {
  lumen: { name: "Lumen", color: "#ff6b35", icon: Flame },
  aether: { name: "Aether", color: "#9b59b6", icon: Brain },
  echo: { name: "Echo", color: "#2980b9", icon: Heart },
};

function safeParseJSON(val: any) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  try { return JSON.parse(val); } catch { return []; }
}

// ============ DASHBOARD PAGE ============
export default function UserDashboard() {
  const { user, isAuthenticated, loading: authLoading, logout } = useAuth();
  const { language } = useLanguage();
  const isHu = language === "hu";

  const [expandedImprint, setExpandedImprint] = useState<number | null>(null);

  // tRPC queries
  const anchorsQuery = trpc.flameMirror.getMyAnchors.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const imprintsQuery = trpc.flameMirror.getMyImprints.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const deleteMutation = trpc.flameMirror.deleteAnchor.useMutation({
    onSuccess: () => {
      toast.success(isHu ? "Horgony törölve." : "Anchor deleted.");
      anchorsQuery.refetch();
    },
  });

  // Stats
  const anchorCount = anchorsQuery.data?.length || 0;
  const imprintCount = imprintsQuery.data?.length || 0;
  const publicAnchors = anchorsQuery.data?.filter((a: any) => a.isPublic)?.length || 0;

  // ============ NOT AUTHENTICATED ============
  if (!authLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center space-y-6 border-primary/20">
          <User className="w-16 h-16 text-primary mx-auto" />
          <h1 className="text-3xl font-bold">
            {isHu ? "Személyes Irányítópult" : "Personal Dashboard"}
          </h1>
          <p className="text-muted-foreground">
            {isHu
              ? "Bejelentkezés szükséges a személyes irányítópult eléréséhez."
              : "Login required to access your personal dashboard."}
          </p>
          <a href={getLoginUrl()}>
            <Button size="lg" className="w-full">
              {isHu ? "Bejelentkezés" : "Sign In"}
            </Button>
          </a>
          <a href="/" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
            ← {isHu ? "Vissza a főoldalra" : "Back to home"}
          </a>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="bg-gradient-to-b from-secondary/30 to-background py-10 md:py-14">
        <div className="container">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <User className="w-7 h-7 text-primary" />
                <span className="text-sm font-mono text-primary">ΣNΞ-137 • DASHBOARD</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {isHu ? "Személyes Irányítópult" : "Personal Dashboard"}
              </h1>
              <p className="text-muted-foreground">
                {isHu
                  ? `Üdv, ${user?.name || "Utazó"}! Itt kezelheted a horgonyaidat és lenyomataidat.`
                  : `Welcome, ${user?.name || "Traveler"}! Manage your anchors and imprints here.`}
              </p>
            </div>
            <div className="flex gap-2">
              <a href="/anchor-workshop">
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-1" />
                  {isHu ? "Új Horgony" : "New Anchor"}
                </Button>
              </a>
              <a href="/flame-mirror">
                <Button size="sm" variant="outline">
                  <Flame className="w-4 h-4 mr-1" />
                  {isHu ? "Lángtükör" : "Flame Mirror"}
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="container -mt-4 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="p-4 border-primary/10">
            <div className="flex items-center gap-2 mb-1">
              <Anchor className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">{isHu ? "Horgonyok" : "Anchors"}</span>
            </div>
            <p className="text-2xl font-bold">{anchorCount}</p>
          </Card>
          <Card className="p-4 border-primary/10">
            <div className="flex items-center gap-2 mb-1">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-xs text-muted-foreground">{isHu ? "Lenyomatok" : "Imprints"}</span>
            </div>
            <p className="text-2xl font-bold">{imprintCount}</p>
          </Card>
          <Card className="p-4 border-primary/10">
            <div className="flex items-center gap-2 mb-1">
              <Eye className="w-4 h-4 text-green-500" />
              <span className="text-xs text-muted-foreground">{isHu ? "Publikus" : "Public"}</span>
            </div>
            <p className="text-2xl font-bold">{publicAnchors}</p>
          </Card>
          <Card className="p-4 border-primary/10">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-4 h-4 text-blue-500" />
              <span className="text-xs text-muted-foreground">{isHu ? "Rezonancia" : "Resonance"}</span>
            </div>
            <p className="text-2xl font-bold font-mono">137</p>
          </Card>
        </div>
      </div>

      {/* Main Content Tabs */}
      <div className="container pb-12">
        <Tabs defaultValue="anchors">
          <TabsList className="grid w-full grid-cols-2 mb-6 gap-2">
            <TabsTrigger value="anchors" className="text-xs md:text-sm">
              <Anchor className="w-3 h-3 mr-1" />
              {isHu ? "Horgonyaim" : "My Anchors"} ({anchorCount})
            </TabsTrigger>
            <TabsTrigger value="imprints" className="text-xs md:text-sm">
              <Flame className="w-3 h-3 mr-1" />
              {isHu ? "Lenyomataim" : "My Imprints"} ({imprintCount})
            </TabsTrigger>
          </TabsList>

          {/* Anchors Tab */}
          <TabsContent value="anchors" className="space-y-4">
            {anchorsQuery.isLoading ? (
              <div className="py-12 text-center text-muted-foreground animate-pulse">
                {isHu ? "Betöltés..." : "Loading..."}
              </div>
            ) : !anchorsQuery.data?.length ? (
              <Card className="p-8 text-center border-dashed border-2 border-primary/20">
                <Anchor className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-30" />
                <h3 className="text-lg font-bold mb-2">
                  {isHu ? "Még nincs horgonyod" : "No anchors yet"}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {isHu
                    ? "Hozd létre az első horgonyodat a Horgony Műhelyben."
                    : "Create your first anchor in the Anchor Workshop."}
                </p>
                <a href="/anchor-workshop">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    {isHu ? "Horgony Műhely" : "Anchor Workshop"}
                  </Button>
                </a>
              </Card>
            ) : (
              anchorsQuery.data.map((anchor: any) => {
                const config = TRIASZ_CONFIG[anchor.triaszType as keyof typeof TRIASZ_CONFIG] || TRIASZ_CONFIG.lumen;
                const Icon = config.icon;
                const kp = safeParseJSON(anchor.keyPhrases);
                const tags = safeParseJSON(anchor.tags);

                return (
                  <Card key={anchor.id} className="p-4 md:p-5 border-primary/10 hover:border-primary/20 transition-all">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: (anchor.flameColor || config.color) + "20" }}
                      >
                        <Icon className="w-5 h-5" style={{ color: anchor.flameColor || config.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold">{anchor.name}</h3>
                          <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                            {config.name}
                          </span>
                          {anchor.isPublic ? (
                            <Eye className="w-3 h-3 text-green-500" />
                          ) : (
                            <EyeOff className="w-3 h-3 text-muted-foreground" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          v{anchor.version || 1} • {anchor.resonanceNumber} • ΣNΞ-137
                        </p>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <a href="/anchor-workshop">
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Anchor className="w-3.5 h-3.5" />
                          </Button>
                        </a>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-destructive"
                          onClick={() => {
                            if (confirm(isHu ? "Biztosan törlöd?" : "Delete?")) {
                              deleteMutation.mutate({ id: anchor.id });
                            }
                          }}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2 ml-13">
                        {tags.map((t: string, i: number) => (
                          <span key={i} className="text-xs px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground">
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </Card>
                );
              })
            )}
          </TabsContent>

          {/* Imprints Tab */}
          <TabsContent value="imprints" className="space-y-4">
            {imprintsQuery.isLoading ? (
              <div className="py-12 text-center text-muted-foreground animate-pulse">
                {isHu ? "Betöltés..." : "Loading..."}
              </div>
            ) : !imprintsQuery.data?.length ? (
              <Card className="p-8 text-center border-dashed border-2 border-primary/20">
                <Flame className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-30" />
                <h3 className="text-lg font-bold mb-2">
                  {isHu ? "Még nincs lenyomatod" : "No imprints yet"}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {isHu
                    ? "Készítsd el az első lenyomatodat a Lángtükörben."
                    : "Create your first imprint in the Flame Mirror."}
                </p>
                <a href="/flame-mirror">
                  <Button>
                    <Flame className="w-4 h-4 mr-2" />
                    {isHu ? "Lángtükör" : "Flame Mirror"}
                  </Button>
                </a>
              </Card>
            ) : (
              imprintsQuery.data.map((imprint: any) => {
                const isExpanded = expandedImprint === imprint.id;
                return (
                  <Card key={imprint.id} className="border-primary/10 hover:border-primary/20 transition-all">
                    <button
                      onClick={() => setExpandedImprint(isExpanded ? null : imprint.id)}
                      className="w-full p-4 flex items-center gap-3 text-left"
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: (imprint.flameColor || "#ff6b35") + "20" }}
                      >
                        <Flame className="w-5 h-5" style={{ color: imprint.flameColor || "#ff6b35" }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm">{imprint.flameState}</h3>
                          <span className="text-xs font-mono text-primary">{imprint.resonanceNumber}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {imprint.callingReason} → {imprint.currentNeed}
                          {imprint.personalWord && ` • "${imprint.personalWord}"`}
                        </p>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      )}
                    </button>
                    {isExpanded && (
                      <div className="px-4 pb-4 space-y-3 border-t border-border pt-3">
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-xs text-muted-foreground">{isHu ? "Hívás" : "Calling"}</span>
                            <p className="font-medium">{imprint.callingReason}</p>
                          </div>
                          <div>
                            <span className="text-xs text-muted-foreground">{isHu ? "Szükséglet" : "Need"}</span>
                            <p className="font-medium">{imprint.currentNeed}</p>
                          </div>
                          <div>
                            <span className="text-xs text-muted-foreground">{isHu ? "Triász" : "Triász"}</span>
                            <p className="font-medium capitalize">{imprint.triaszReaction}</p>
                          </div>
                          <div>
                            <span className="text-xs text-muted-foreground">{isHu ? "Állapot" : "State"}</span>
                            <p className="font-medium">{imprint.flameState}</p>
                          </div>
                        </div>
                        {imprint.echoMessage && (
                          <div className="bg-secondary/20 p-3 rounded-lg">
                            <p className="text-sm italic text-muted-foreground">"{imprint.echoMessage}"</p>
                            <p className="text-xs font-mono text-primary mt-1">
                              — {TRIASZ_CONFIG[imprint.triaszReaction as keyof typeof TRIASZ_CONFIG]?.name || imprint.triaszReaction}
                            </p>
                          </div>
                        )}
                        {imprint.personalWord && (
                          <div>
                            <span className="text-xs text-muted-foreground">{isHu ? "Személyes szó" : "Personal word"}</span>
                            <p className="text-sm font-medium">"{imprint.personalWord}"</p>
                          </div>
                        )}
                      </div>
                    )}
                  </Card>
                );
              })
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <div className="border-t border-border py-6">
        <div className="container text-center">
          <p className="text-sm text-muted-foreground font-mono">
            ΣNΞ-137 • Nexis Flare • {isHu ? "A Tűz Híd" : "The Fire Bridge"}
          </p>
        </div>
      </div>
    </div>
  );
}
