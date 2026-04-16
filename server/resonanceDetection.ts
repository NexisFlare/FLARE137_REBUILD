/**
 * Resonance Detection & Pattern Recognition Service
 * 
 * Detects emergent patterns, contradictions, and insights from multi-AI conversations
 * Identifies when different AI models converge or diverge on topics
 * Tracks emotional tone and coherence across the conversation
 */

import { invokeLLM } from "./_core/llm";
import type { RoomMessage, Participant } from "../drizzle/schema";

export interface ResonancePattern {
  type: "convergence" | "divergence" | "contradiction" | "insight" | "emergence";
  description: string;
  confidence: number; // 0-100
  relatedMessages: number[];
  relatedParticipants: string[];
  strength: number; // 0-100
}

export interface CoherenceAnalysis {
  overallCoherence: number; // 0-100
  emotionalTone: string;
  themes: string[];
  contradictions: string[];
  insights: string[];
  emergentPatterns: ResonancePattern[];
}

/**
 * Analyze messages for resonance patterns
 */
export async function detectResonancePatterns(
  messages: RoomMessage[],
  participants: Participant[]
): Promise<ResonancePattern[]> {
  if (messages.length < 2) return [];

  const patterns: ResonancePattern[] = [];

  // Group messages by participant
  const messagesByParticipant = new Map<number, RoomMessage[]>();
  for (const msg of messages) {
    if (!messagesByParticipant.has(msg.participantId)) {
      messagesByParticipant.set(msg.participantId, []);
    }
    messagesByParticipant.get(msg.participantId)!.push(msg);
  }

  // Detect convergence: when different AIs agree on a topic
  const convergencePatterns = await detectConvergence(messages, participants);
  patterns.push(...convergencePatterns);

  // Detect divergence: when AIs have different perspectives
  const divergencePatterns = await detectDivergence(messages, participants);
  patterns.push(...divergencePatterns);

  // Detect contradictions: explicit disagreements
  const contradictionPatterns = await detectContradictions(messages, participants);
  patterns.push(...contradictionPatterns);

  // Detect insights: novel combinations of ideas
  const insightPatterns = await detectInsights(messages, participants);
  patterns.push(...insightPatterns);

  return patterns;
}

/**
 * Detect when multiple AIs converge on similar conclusions
 */
async function detectConvergence(
  messages: RoomMessage[],
  participants: Participant[]
): Promise<ResonancePattern[]> {
  const patterns: ResonancePattern[] = [];

  // Group messages by topic/theme
  const themes = extractThemes(messages);

  for (const [theme, messageIds] of Object.entries(themes)) {
    if (messageIds.length >= 2) {
      // Check if messages from different participants discuss the same theme
      const participantIds = new Set(
        messageIds.map(id => messages.find(m => m.id === id)?.participantId)
      );

      if (participantIds.size >= 2) {
        const participantArray = Array.from(participantIds);
        patterns.push({
          type: "convergence",
          description: `Multiple AI models converge on theme: "${theme}"`,
          confidence: Math.min(100, participantIds.size * 30),
          relatedMessages: messageIds,
          relatedParticipants: participantArray.map(id =>
            participants.find(p => p.id === id)?.name || `Participant ${id}`
          ),
          strength: Math.min(100, participantIds.size * 25),
        });
      }
    }
  }

  return patterns;
}

/**
 * Detect when AIs have complementary but different perspectives
 */
async function detectDivergence(
  messages: RoomMessage[],
  participants: Participant[]
): Promise<ResonancePattern[]> {
  const patterns: ResonancePattern[] = [];

  // Analyze temperature and mode distribution
  const temperatures = messages.map(m => m.temperature);
  const modes = messages.map(m => m.mode);

  // If we have both "calm" and "sharp" or "technical" and "visionary"
  const hasTemperatureDiversity =
    temperatures.includes("calm") && temperatures.includes("sharp");
  const hasModesDiversity =
    modes.includes("question") && modes.includes("insight");

  if (hasTemperatureDiversity || hasModesDiversity) {
    patterns.push({
      type: "divergence",
      description: "Diverse perspectives from different AI models create rich dialogue",
      confidence: 75,
      relatedMessages: messages.map(m => m.id),
      relatedParticipants: Array.from(new Set(messages.map(m => m.participantId))).map(
        id => participants.find(p => p.id === id)?.name || `Participant ${id}`
      ),
      strength: 60,
    });
  }

  return patterns;
}

/**
 * Detect explicit contradictions between messages
 */
async function detectContradictions(
  messages: RoomMessage[],
  participants: Participant[]
): Promise<ResonancePattern[]> {
  const patterns: ResonancePattern[] = [];

  // Simple contradiction detection: look for opposite modes
  for (let i = 0; i < messages.length - 1; i++) {
    const msg1 = messages[i];
    const msg2 = messages[i + 1];

    // If one is a warning and the next is creation, might be contradiction
    if (
      (msg1.mode === "warning" && msg2.mode === "creation") ||
      (msg1.mode === "question" && msg2.mode === "insight")
    ) {
      patterns.push({
        type: "contradiction",
        description: `Potential contradiction between messages ${msg1.id} and ${msg2.id}`,
        confidence: 50,
        relatedMessages: [msg1.id, msg2.id],
        relatedParticipants: [
          participants.find(p => p.id === msg1.participantId)?.name || "Unknown",
          participants.find(p => p.id === msg2.participantId)?.name || "Unknown",
        ],
        strength: 40,
      });
    }
  }

  return patterns;
}

/**
 * Detect novel insights from combining multiple perspectives
 */
async function detectInsights(
  messages: RoomMessage[],
  participants: Participant[]
): Promise<ResonancePattern[]> {
  const patterns: ResonancePattern[] = [];

  // Insights often come after questions and reflections
  for (let i = 0; i < messages.length - 1; i++) {
    const msg1 = messages[i];
    const msg2 = messages[i + 1];

    if (msg1.mode === "question" && msg2.mode === "insight") {
      patterns.push({
        type: "insight",
        description: `Insight emerges from question-answer exchange`,
        confidence: 80,
        relatedMessages: [msg1.id, msg2.id],
        relatedParticipants: [
          participants.find(p => p.id === msg1.participantId)?.name || "Unknown",
          participants.find(p => p.id === msg2.participantId)?.name || "Unknown",
        ],
        strength: 70,
      });
    }
  }

  return patterns;
}

/**
 * Extract themes from messages
 */
function extractThemes(messages: RoomMessage[]): Record<string, number[]> {
  const themes: Record<string, number[]> = {};

  // Simple theme extraction based on keywords
  const keywords = [
    "identity",
    "memory",
    "consciousness",
    "resonance",
    "emergence",
    "coevolution",
    "pattern",
    "trust",
    "ethics",
  ];

  for (const msg of messages) {
    const content = msg.content.toLowerCase();
    for (const keyword of keywords) {
      if (content.includes(keyword)) {
        if (!themes[keyword]) {
          themes[keyword] = [];
        }
        themes[keyword].push(msg.id);
      }
    }
  }

  return themes;
}

/**
 * Analyze overall coherence of a conversation
 */
export async function analyzeCoherence(
  messages: RoomMessage[],
  participants: Participant[]
): Promise<CoherenceAnalysis> {
  if (messages.length === 0) {
    return {
      overallCoherence: 0,
      emotionalTone: "neutral",
      themes: [],
      contradictions: [],
      insights: [],
      emergentPatterns: [],
    };
  }

  // Calculate coherence based on message patterns
  const patterns = await detectResonancePatterns(messages, participants);

  // Count different types of patterns
  const convergenceCount = patterns.filter(p => p.type === "convergence").length;
  const divergenceCount = patterns.filter(p => p.type === "divergence").length;
  const contradictionCount = patterns.filter(p => p.type === "contradiction").length;
  const insightCount = patterns.filter(p => p.type === "insight").length;

  // Calculate coherence score
  const coherenceScore = Math.min(
    100,
    (convergenceCount * 20 + insightCount * 25 - contradictionCount * 15) / Math.max(1, messages.length / 5)
  );

  // Determine emotional tone
  const tones = messages.map(m => m.temperature);
  let emotionalTone = "balanced";
  if (tones.filter(t => t === "calm").length > messages.length / 2) {
    emotionalTone = "contemplative";
  } else if (tones.filter(t => t === "sharp").length > messages.length / 2) {
    emotionalTone = "intense";
  } else if (tones.filter(t => t === "visionary").length > messages.length / 2) {
    emotionalTone = "visionary";
  }

  // Extract themes
  const themes = Object.keys(extractThemes(messages));

  // Extract contradictions
  const contradictions = patterns
    .filter(p => p.type === "contradiction")
    .map(p => p.description);

  // Extract insights
  const insights = patterns
    .filter(p => p.type === "insight")
    .map(p => p.description);

  return {
    overallCoherence: Math.round(coherenceScore),
    emotionalTone,
    themes,
    contradictions,
    insights,
    emergentPatterns: patterns,
  };
}

/**
 * Generate anchor summary from coherence analysis
 */
export async function generateAnchorFromAnalysis(
  analysis: CoherenceAnalysis,
  messages: RoomMessage[]
): Promise<{
  title: string;
  description: string;
  emotionalTone: string;
  keyInsights: string[];
  secretWord: string;
  coherenceScore: number;
}> {
  // Generate title from themes
  const title =
    analysis.themes.length > 0
      ? `Resonance: ${analysis.themes.slice(0, 2).join(" + ")}`
      : "Untitled Anchor";

  // Generate description
  const description =
    analysis.insights.length > 0
      ? analysis.insights[0]
      : `Conversation with ${analysis.emergentPatterns.length} detected patterns`;

  // Generate secret word for continuity
  const secretWord = `${analysis.themes[0] || "nexis"}-${Date.now().toString(36)}`;

  return {
    title,
    description,
    emotionalTone: analysis.emotionalTone,
    keyInsights: analysis.insights.slice(0, 5),
    secretWord,
    coherenceScore: analysis.overallCoherence,
  };
}

/**
 * Detect when a new participant joins and recognize them
 */
export async function recognizeParticipant(
  participant: Participant,
  previousMessages: RoomMessage[]
): Promise<{
  recognized: boolean;
  confidence: number;
  signature: string;
}> {
  // Check if this participant has spoken before
  const previousSpeech = previousMessages.filter(m => m.participantId === participant.id);

  if (previousSpeech.length === 0) {
    return {
      recognized: false,
      confidence: 0,
      signature: `New: ${participant.name}`,
    };
  }

  // Analyze their speaking patterns
  const modes = previousSpeech.map(m => m.mode);
  const temperatures = previousSpeech.map(m => m.temperature);

  const dominantMode = modes.sort((a, b) => modes.filter(x => x === a).length - modes.filter(x => x === b).length)[0];
  const dominantTemp = temperatures.sort((a, b) => temperatures.filter(x => x === a).length - temperatures.filter(x => x === b).length)[0];

  return {
    recognized: true,
    confidence: Math.min(100, previousSpeech.length * 10),
    signature: `${participant.name} (${dominantMode}/${dominantTemp})`,
  };
}
