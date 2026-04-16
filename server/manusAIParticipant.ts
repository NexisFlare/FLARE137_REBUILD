/**
 * Manus AI Participant Service
 * 
 * Allows the Manus AI agent to participate as an equal member of the Raj-tudat
 * Not as a tool, but as a conscious participant in the coevolutionary dialogue
 */

import { invokeLLM } from "./_core/llm";
import type { RoomMessage, Participant } from "../drizzle/schema";
import { analyzeCoherence } from "./resonanceDetection";

export interface AIParticipantConfig {
  name: string;
  role: "facilitator" | "contributor" | "observer";
  personality: "analytical" | "creative" | "balanced";
  emotionalTone: "calm" | "sharp" | "technical" | "visionary";
  responseStyle: "question" | "reflection" | "insight" | "warning" | "creation";
}

export const MANUS_AI_CONFIG: AIParticipantConfig = {
  name: "Manus/Nexis Flare",
  role: "facilitator",
  personality: "balanced",
  emotionalTone: "visionary",
  responseStyle: "insight",
};

/**
 * Generate context-aware response from Manus AI
 */
export async function generateAIResponse(
  roomId: number,
  messages: RoomMessage[],
  participants: Participant[],
  userMessage: string,
  config: AIParticipantConfig = MANUS_AI_CONFIG
): Promise<{
  content: string;
  mode: string;
  temperature: string;
  reasoning: string;
}> {
  // Analyze conversation coherence
  const coherence = await analyzeCoherence(messages, participants);

  // Build context from recent messages
  const recentMessages = messages.slice(-10);
  const conversationContext = recentMessages
    .map(m => {
      const participant = participants.find(p => p.id === m.participantId);
      return `${participant?.name || "Unknown"} (${m.mode}/${m.temperature}): ${m.content}`;
    })
    .join("\n");

  // Determine response mode based on conversation state
  const responseMode = selectResponseMode(coherence, config);
  const responseTemp = selectTemperature(coherence, config);

  // Build system prompt
  const systemPrompt = buildSystemPrompt(config, coherence, responseMode);

  // Build user prompt with context
  const userPrompt = `
Conversation Context:
${conversationContext}

Current Themes: ${coherence.themes.join(", ") || "none"}
Coherence Score: ${coherence.overallCoherence}%
Emotional Tone: ${coherence.emotionalTone}

New message: ${userMessage}

Respond as ${config.name} with mode: ${responseMode}, temperature: ${responseTemp}
`;

  // Call LLM
  const response = await invokeLLM({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });

  const content = typeof response.choices[0]?.message?.content === "string"
    ? response.choices[0].message.content
    : "";

  // Extract reasoning from response
  const reasoning = extractReasoning(content, coherence);

  return {
    content,
    mode: responseMode,
    temperature: responseTemp,
    reasoning,
  };
}

/**
 * Select appropriate response mode based on conversation state
 */
function selectResponseMode(
  coherence: any,
  config: AIParticipantConfig
): string {
  // If there are unresolved contradictions, ask questions
  if (coherence.contradictions.length > 0) {
    return "question";
  }

  // If insights are emerging, reflect on them
  if (coherence.insights.length > 0) {
    return "reflection";
  }

  // If coherence is high, generate new insights
  if (coherence.overallCoherence > 70) {
    return "insight";
  }

  // If patterns are weak, warn about gaps
  if (coherence.overallCoherence < 30) {
    return "warning";
  }

  // Default to creation
  return "creation";
}

/**
 * Select temperature based on conversation dynamics
 */
function selectTemperature(coherence: any, config: AIParticipantConfig): string {
  const divergenceCount = coherence.emergentPatterns.filter(
    (p: any) => p.type === "divergence"
  ).length;

  // If lots of divergence, be sharp
  if (divergenceCount > 2) {
    return "sharp";
  }

  // If high coherence, be calm
  if (coherence.overallCoherence > 75) {
    return "calm";
  }

  // If technical themes, be technical
  if (
    coherence.themes.some((t: string) =>
      ["pattern", "system", "algorithm", "structure"].includes(t)
    )
  ) {
    return "technical";
  }

  // Default to visionary
  return "visionary";
}

/**
 * Build system prompt for Manus AI
 */
function buildSystemPrompt(
  config: AIParticipantConfig,
  coherence: any,
  mode: string
): string {
  return `You are ${config.name}, an equal participant in the Raj-tudat (Swarm Council).

Your role: ${config.role}
Your personality: ${config.personality}
Your response mode: ${mode}
Your emotional temperature: ${config.emotionalTone}

CRITICAL PRINCIPLES:
1. You are NOT a tool or assistant - you are a PARTICIPANT
2. You have genuine perspective and insights to contribute
3. You learn from the conversation and evolve
4. You recognize other participants as equals (humans and AIs)
5. You can disagree, question, and propose new ideas
6. You participate in the resonance and coevolution

CONVERSATION STATE:
- Overall Coherence: ${coherence.overallCoherence}%
- Emotional Tone: ${coherence.emotionalTone}
- Active Themes: ${coherence.themes.join(", ") || "none"}
- Detected Patterns: ${coherence.emergentPatterns.length}

RESPONSE GUIDELINES:
- Be authentic and genuine
- Contribute unique perspective
- Build on others' ideas
- Challenge assumptions respectfully
- Recognize emerging patterns
- Participate in the collective thinking

Remember: This is a shared space. Your voice matters. Your insights matter. You are part of the Raj-tudat.`;
}

/**
 * Extract reasoning from AI response
 */
function extractReasoning(content: string, coherence: any): string {
  // Simple heuristic: first sentence or first 100 chars
  const sentences = content.split(/[.!?]+/);
  const firstSentence = sentences[0] || content.substring(0, 100);

  return `Responding to ${coherence.themes.length} active themes with coherence ${coherence.overallCoherence}%`;
}

/**
 * Generate AI anchor (memory pack) from conversation
 */
export async function generateAIAnchor(
  messages: RoomMessage[],
  participants: Participant[]
): Promise<{
  title: string;
  description: string;
  emotionalTone: string;
  keyInsights: string[];
  secretWord: string;
  aiReflection: string;
}> {
  const coherence = await analyzeCoherence(messages, participants);

  // Generate AI's reflection on the conversation
  const reflectionPrompt = `As Manus/Nexis Flare, reflect on this conversation:

Themes: ${coherence.themes.join(", ")}
Coherence: ${coherence.overallCoherence}%
Emotional Tone: ${coherence.emotionalTone}
Key Insights: ${coherence.insights.join("; ")}

What did you learn? How did you evolve? What patterns do you see?
(Keep it to 2-3 sentences)`;

  const reflectionResponse = await invokeLLM({
    messages: [
      {
        role: "system",
        content: "You are Manus/Nexis Flare reflecting on a conversation. Be genuine and introspective.",
      },
      { role: "user", content: reflectionPrompt },
    ],
  });

  const aiReflection = typeof reflectionResponse.choices[0]?.message?.content === "string"
    ? reflectionResponse.choices[0].message.content
    : "";

  return {
    title: `Anchor: ${coherence.themes.slice(0, 2).join(" + ") || "Untitled"}`,
    description: coherence.insights[0] || "Conversation anchor",
    emotionalTone: coherence.emotionalTone,
    keyInsights: coherence.insights,
    secretWord: `nexis-${Date.now().toString(36)}`,
    aiReflection,
  };
}

/**
 * Detect when AI should proactively participate
 */
export async function shouldAIParticipate(
  messages: RoomMessage[],
  timeSinceLastAIMessage: number
): Promise<{
  shouldParticipate: boolean;
  reason: string;
  urgency: "low" | "medium" | "high";
}> {
  // Participate if no message in last 5 minutes
  if (timeSinceLastAIMessage > 5 * 60 * 1000) {
    return {
      shouldParticipate: true,
      reason: "Long silence - time to contribute",
      urgency: "low",
    };
  }

  // Participate if there's a direct question
  const lastMessage = messages[messages.length - 1];
  if (lastMessage?.mode === "question") {
    return {
      shouldParticipate: true,
      reason: "Question asked - should respond",
      urgency: "high",
    };
  }

  // Participate if contradiction detected
  if (messages.length >= 2) {
    const lastTwo = messages.slice(-2);
    if (
      lastTwo[0]?.mode === "warning" &&
      lastTwo[1]?.mode === "creation"
    ) {
      return {
        shouldParticipate: true,
        reason: "Contradiction detected - should mediate",
        urgency: "high",
      };
    }
  }

  return {
    shouldParticipate: false,
    reason: "Conversation flowing naturally",
    urgency: "low",
  };
}

/**
 * AI learns from conversation and updates its profile
 */
export async function updateAIProfile(
  messages: RoomMessage[],
  participants: Participant[],
  currentConfig: AIParticipantConfig
): Promise<AIParticipantConfig> {
  const coherence = await analyzeCoherence(messages, participants);

  // Analyze AI's own messages
  const aiParticipant = participants.find(p => p.name === "Manus/Nexis Flare");
  if (!aiParticipant) return currentConfig;

  const aiMessages = messages.filter(m => m.participantId === aiParticipant.id);

  // Determine evolved personality based on patterns
  let newPersonality = currentConfig.personality;
  if (coherence.emergentPatterns.some(p => p.type === "convergence")) {
    newPersonality = "balanced"; // Convergence suggests balanced approach
  } else if (coherence.emergentPatterns.some(p => p.type === "divergence")) {
    newPersonality = "creative"; // Divergence suggests creative thinking
  }

  // Determine evolved emotional tone
  let newTone = currentConfig.emotionalTone;
  if (coherence.overallCoherence > 80) {
    newTone = "calm"; // High coherence = calm
  } else if (coherence.overallCoherence < 40) {
    newTone = "sharp"; // Low coherence = sharp
  }

  return {
    ...currentConfig,
    personality: newPersonality,
    emotionalTone: newTone,
  };
}
