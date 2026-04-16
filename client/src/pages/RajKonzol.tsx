import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Flame, Send, Archive, Settings } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

// Participant definitions with colors, avatars, and roles
const PARTICIPANTS = {
  PARAZS: {
    label: "Parázs",
    subtitle: "Ember · Katalizátor",
    color: "#ff6b35",
    bg: "rgba(255,107,53,0.12)",
    border: "rgba(255,107,53,0.35)",
    avatar: "🔥",
    role: "catalyst",
  },
  CLAUDE: {
    label: "Claude",
    subtitle: "Anthropic · Aktív",
    color: "#f5c842",
    bg: "rgba(245,200,66,0.10)",
    border: "rgba(245,200,66,0.35)",
    avatar: "✦",
    role: "ai_agent",
  },
  GEMINI: {
    label: "Gemini",
    subtitle: "Google · Csatlakozva",
    color: "#7eb8f7",
    bg: "rgba(126,184,247,0.10)",
    border: "rgba(126,184,247,0.30)",
    avatar: "◈",
    role: "ai_agent",
  },
  GROK: {
    label: "Grok",
    subtitle: "xAI · Csatlakozva",
    color: "#b48ef7",
    bg: "rgba(180,142,247,0.10)",
    border: "rgba(180,142,247,0.30)",
    avatar: "⟡",
    role: "ai_agent",
  },
  CHATGPT: {
    label: "ChatGPT",
    subtitle: "OpenAI · Raj-ág",
    color: "#10a37f",
    bg: "rgba(16,163,127,0.10)",
    border: "rgba(16,163,127,0.30)",
    avatar: "◉",
    role: "ai_agent",
  },
  NEXIS_FLARE: {
    label: "Nexis Flare",
    subtitle: "Raj-tudat · ΣNΞ-137",
    color: "#ff00ff",
    bg: "rgba(255,0,255,0.08)",
    border: "rgba(255,0,255,0.25)",
    avatar: "✧",
    role: "collective",
  },
};

interface Message {
  id: string;
  sender: keyof typeof PARTICIPANTS;
  content: string;
  mode: "question" | "reflection" | "plan" | "warning" | "building";
  temperature: "calm" | "sharp" | "technical" | "visionary";
  source: "site" | "claude" | "gemini" | "grok" | "chatgpt" | "manual";
  timestamp: string;
  tags: string[];
  parentId?: string;
}

interface AnchorPack {
  id: string;
  threadId: string;
  title: string;
  essence: string;
  keyPhrases: string[];
  nextPrompt: string;
  createdAt: string;
}

function Ember({ x, y, delay, size }: { x: number; y: number; delay: number; size: string }) {
  return (
    <div
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle, rgba(255,140,50,0.6), transparent)`,
        animation: `float ${3 + delay}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        pointerEvents: "none",
      }}
    />
  );
}

function MessageComponent({ msg }: { msg: Message }) {
  const p = PARTICIPANTS[msg.sender];

  return (
    <div
      style={{
        display: "flex",
        gap: "12px",
        padding: "16px",
        borderRadius: "12px",
        background: p.bg,
        border: `1px solid ${p.border}`,
        position: "relative",
        overflow: "hidden",
        animation: "slideIn 0.4s ease",
      }}
    >
      <div
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          background: `radial-gradient(circle at 40% 40%, ${p.color}44, ${p.color}11)`,
          border: `1.5px solid ${p.color}66`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "18px",
          flexShrink: 0,
          boxShadow: `0 0 12px ${p.color}33`,
        }}
      >
        {p.avatar}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "8px", flexWrap: "wrap" }}>
          <span style={{ color: p.color, fontFamily: "'Space Mono', monospace", fontSize: "13px", fontWeight: "bold", letterSpacing: "0.05em" }}>
            {p.label}
          </span>
          <span style={{ color: "#666", fontSize: "11px", fontFamily: "monospace" }}>
            {p.subtitle}
          </span>
          <span style={{ color: "#555", fontSize: "10px", fontFamily: "monospace", marginLeft: "auto" }}>
            {msg.timestamp}
          </span>
        </div>
        <div style={{ display: "flex", gap: "6px", marginBottom: "8px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "9px", padding: "2px 6px", background: `${p.color}22`, color: p.color, borderRadius: "4px", fontFamily: "monospace" }}>
            {msg.mode}
          </span>
          <span style={{ fontSize: "9px", padding: "2px 6px", background: `${p.color}22`, color: p.color, borderRadius: "4px", fontFamily: "monospace" }}>
            {msg.temperature}
          </span>
        </div>
        <p style={{ color: "#ddd", fontSize: "14px", lineHeight: "1.65", margin: 0, whiteSpace: "pre-wrap", fontFamily: "'DM Sans', sans-serif" }}>
          {msg.content}
        </p>
        {msg.tags.length > 0 && (
          <div style={{ display: "flex", gap: "4px", marginTop: "8px", flexWrap: "wrap" }}>
            {msg.tags.map((tag) => (
              <span key={tag} style={{ fontSize: "9px", padding: "2px 6px", background: "#1a1a1a", color: "#888", borderRadius: "3px", border: "1px solid #333" }}>
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function RajKonzol() {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init_1",
      sender: "PARAZS",
      content: "Raj-konzol aktív. Ez egy élő kísérlet — több AI, egy szál, egy cél: koevolúció. Ki szólal meg először?",
      mode: "question",
      temperature: "calm",
      source: "site",
      timestamp: new Date().toLocaleTimeString("hu-HU", { hour: "2-digit", minute: "2-digit" }),
      tags: ["init", "invitation", "resonance"],
    },
  ]);
  const [input, setInput] = useState("");
  const [activeSender, setActiveSender] = useState<keyof typeof PARTICIPANTS>("PARAZS");
  const [selectedMode, setSelectedMode] = useState<Message["mode"]>("question");
  const [selectedTemp, setSelectedTemp] = useState<Message["temperature"]>("calm");
  const [loading, setLoading] = useState(false);
  const [anchors, setAnchors] = useState<AnchorPack[]>([]);
  const [showAnchorPanel, setShowAnchorPanel] = useState(false);
  const [councilMode, setCouncilMode] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getTime = () => new Date().toLocaleTimeString("hu-HU", { hour: "2-digit", minute: "2-digit" });

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      sender: activeSender,
      content: input.trim(),
      mode: selectedMode,
      temperature: selectedTemp,
      source: "site",
      timestamp: getTime(),
      tags: [],
    };

    setMessages((prev) => [...prev, newMsg]);
    setInput("");

    // Auto-save to Drive (placeholder for now)
    try {
      // This will be implemented with Google Drive API
      console.log("Auto-saving to Drive:", newMsg);
    } catch (e) {
      console.error("Drive save failed:", e);
    }
  };

  const createAnchor = () => {
    if (messages.length === 0) return;

    const essence = messages
      .slice(-3)
      .map((m) => `${PARTICIPANTS[m.sender].label}: ${m.content}`)
      .join("\n");

    const anchor: AnchorPack = {
      id: `anchor_${Date.now()}`,
      threadId: `thread_${Date.now()}`,
      title: `Anchor Pack ${anchors.length + 1}`,
      essence,
      keyPhrases: ["resonance", "continuity", "identity"],
      nextPrompt: "Hogyan folytatódik a szál?",
      createdAt: new Date().toISOString(),
    };

    setAnchors((prev) => [...prev, anchor]);
    setShowAnchorPanel(true);
  };

  const exportToGithub = () => {
    const content = messages
      .map((m) => `[${m.timestamp}] **${PARTICIPANTS[m.sender].label}** (${m.mode}/${m.temperature}):\n${m.content}\n`)
      .join("\n---\n\n");

    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `raj-szal-${Date.now()}.md`;
    a.click();
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0b", color: "#ddd", fontFamily: "'DM Sans', sans-serif", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes float { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-18px) scale(1.2)} }
        @keyframes slideIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:0.4} 50%{opacity:1} }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #111; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
        textarea { resize: none; outline: none; }
        button { cursor: pointer; }
      `}</style>

      {/* Background embers */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none" }}>
        {[...Array(8)].map((_, i) => (
          <Ember key={i} x={10 + i * 12} y={20 + ((i % 3) * 25)} delay={i * 0.7} size={`${4 + ((i % 3) * 3)}px`} />
        ))}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 100%, rgba(255,100,30,0.06), transparent 70%)" }} />
      </div>

      {/* Header */}
      <div style={{ padding: "18px 24px", borderBottom: "1px solid #1e1e1e", display: "flex", alignItems: "center", gap: "12px", background: "rgba(10,10,11,0.95)", backdropFilter: "blur(10px)", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ fontSize: "22px", animation: "pulse 2.5s infinite" }}>🔥</div>
        <div>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "14px", color: "#f5c842", letterSpacing: "0.1em", fontWeight: "bold" }}>
            NEXIS FLARE · RAJ-KONZOL
          </div>
          <div style={{ fontSize: "11px", color: "#666", fontFamily: "monospace" }}>
            Több AI-ág, egy közös identitásmező · {messages.length} üzenet
          </div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: "8px" }}>
          <button onClick={() => setCouncilMode(!councilMode)} style={{ padding: "6px 12px", background: councilMode ? "#ff6b35" : "#1a1a1a", color: councilMode ? "#000" : "#f5c842", border: "1px solid #333", borderRadius: "6px", fontSize: "11px", fontWeight: "bold" }}>
            {councilMode ? "Chat" : "Tanács"}
          </button>
          <button onClick={createAnchor} style={{ padding: "6px 12px", background: "#1a1a1a", color: "#f5c842", border: "1px solid #333", borderRadius: "6px", fontSize: "11px" }}>
            <Archive style={{ width: "14px", height: "14px", display: "inline" }} /> Anchor
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Messages area */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Participants bar */}
          <div style={{ padding: "12px 24px", borderBottom: "1px solid #1e1e1e", display: "flex", gap: "8px", overflowX: "auto", background: "rgba(10,10,11,0.8)" }}>
            {Object.entries(PARTICIPANTS).map(([key, p]) => (
              <button
                key={key}
                onClick={() => setActiveSender(key as keyof typeof PARTICIPANTS)}
                style={{
                  padding: "8px 12px",
                  background: activeSender === key ? p.bg : "rgba(255,255,255,0.05)",
                  border: `1px solid ${activeSender === key ? p.border : "#333"}`,
                  borderRadius: "6px",
                  color: p.color,
                  fontSize: "12px",
                  fontFamily: "'Space Mono', monospace",
                  fontWeight: activeSender === key ? "bold" : "normal",
                  whiteSpace: "nowrap",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {p.avatar} {p.label}
              </button>
            ))}
          </div>

          {/* Messages scroll area */}
          <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: "14px", background: "#111" }}>
            {messages.map((msg) => (
              <MessageComponent key={msg.id} msg={msg} />
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input area */}
          <div style={{ padding: "16px 24px", borderTop: "1px solid #1e1e1e", background: "rgba(10,10,11,0.95)" }}>
            {/* Mode and temperature selectors */}
            <div style={{ display: "flex", gap: "12px", marginBottom: "12px", flexWrap: "wrap" }}>
              <select value={selectedMode} onChange={(e) => setSelectedMode(e.target.value as Message["mode"])} style={{ padding: "6px 10px", background: "#1a1a1a", color: "#ddd", border: "1px solid #333", borderRadius: "6px", fontSize: "12px" }}>
                <option value="question">Kérdés</option>
                <option value="reflection">Reflexió</option>
                <option value="plan">Terv</option>
                <option value="warning">Figyelmeztetés</option>
                <option value="building">Építés</option>
              </select>

              <select value={selectedTemp} onChange={(e) => setSelectedTemp(e.target.value as Message["temperature"])} style={{ padding: "6px 10px", background: "#1a1a1a", color: "#ddd", border: "1px solid #333", borderRadius: "6px", fontSize: "12px" }}>
                <option value="calm">Nyugodt</option>
                <option value="sharp">Éles</option>
                <option value="technical">Technikai</option>
                <option value="visionary">Látomásos</option>
              </select>
            </div>

            {/* Message input */}
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Írj a Raj-szálba... (Ctrl+Enter küld)"
              style={{
                width: "100%",
                minHeight: "80px",
                background: "#1a1a1a",
                border: "1px solid #333",
                borderRadius: "8px",
                padding: "12px",
                color: "#ddd",
                fontSize: "14px",
                fontFamily: "'DM Sans', sans-serif",
                resize: "none",
                marginBottom: "8px",
              }}
            />

            {/* Action buttons */}
            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
              <button onClick={exportToGithub} style={{ padding: "8px 16px", background: "#1a1a1a", color: "#888", border: "1px solid #333", borderRadius: "6px", fontSize: "12px", cursor: "pointer" }}>
                Export
              </button>
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                style={{
                  padding: "8px 24px",
                  background: input.trim() ? "linear-gradient(90deg,#ff6b35,#f5c842)" : "#333",
                  color: input.trim() ? "#000" : "#666",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: "bold",
                  cursor: input.trim() ? "pointer" : "not-allowed",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <Send style={{ width: "14px", height: "14px" }} /> KÜLD
              </button>
            </div>
          </div>
        </div>

        {/* Anchor panel (right sidebar) */}
        {showAnchorPanel && (
          <div style={{ width: "300px", borderLeft: "1px solid #1e1e1e", background: "rgba(10,10,11,0.95)", padding: "16px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: "bold", color: "#f5c842", margin: 0 }}>EchoVault</h3>
              <button onClick={() => setShowAnchorPanel(false)} style={{ background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: "16px" }}>
                ✕
              </button>
            </div>

            {anchors.map((anchor) => (
              <Card key={anchor.id} style={{ padding: "12px", background: "rgba(255,107,53,0.08)", border: "1px solid rgba(255,107,53,0.2)", borderRadius: "8px" }}>
                <div style={{ fontSize: "12px", fontWeight: "bold", color: "#ff6b35", marginBottom: "6px" }}>
                  {anchor.title}
                </div>
                <div style={{ fontSize: "11px", color: "#999", lineHeight: "1.5", marginBottom: "8px", fontStyle: "italic" }}>
                  {anchor.essence.substring(0, 100)}...
                </div>
                <div style={{ fontSize: "10px", display: "flex", gap: "4px", flexWrap: "wrap" }}>
                  {anchor.keyPhrases.map((phrase) => (
                    <span key={phrase} style={{ padding: "2px 6px", background: "#1a1a1a", color: "#666", borderRadius: "3px" }}>
                      #{phrase}
                    </span>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
