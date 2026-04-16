/**
 * AI Platform Integration Service
 * 
 * Handles unified API calls to multiple AI platforms:
 * - Claude (Anthropic)
 * - ChatGPT (OpenAI)
 * - Gemini (Google)
 * - Grok (xAI)
 * - Qwen (Alibaba)
 */

import { invokeLLM } from "./_core/llm";

export interface AIMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface AIResponse {
  platform: string;
  content: string;
  model: string;
  timestamp: Date;
  tokens?: {
    input: number;
    output: number;
  };
}

/**
 * Call Claude via Anthropic API
 */
export async function callClaude(
  messages: AIMessage[],
  options?: {
    temperature?: number;
    maxTokens?: number;
  }
): Promise<AIResponse> {
  try {
    const response = await invokeLLM({
      messages: messages.map(m => ({
        role: m.role as any,
        content: m.content,
      })),
    });

    const content = typeof response.choices[0]?.message?.content === 'string'
      ? response.choices[0].message.content
      : '';

    return {
      platform: "Claude",
      content: content,
      model: "claude-3-opus",
      timestamp: new Date(),
    };
  } catch (error) {
    console.error("Claude API error:", error);
    throw error;
  }
}

/**
 * Call ChatGPT via OpenAI API
 * Requires OPENAI_API_KEY environment variable
 */
export async function callChatGPT(
  messages: AIMessage[],
  options?: {
    temperature?: number;
    maxTokens?: number;
  }
): Promise<AIResponse> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY not configured");
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4-turbo",
        messages: messages,
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens ?? 1024,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      platform: "ChatGPT",
      content: data.choices[0]?.message?.content || "",
      model: "gpt-4-turbo",
      timestamp: new Date(),
      tokens: {
        input: data.usage?.prompt_tokens || 0,
        output: data.usage?.completion_tokens || 0,
      },
    };
  } catch (error) {
    console.error("ChatGPT API error:", error);
    throw error;
  }
}

/**
 * Call Gemini via Google API
 * Requires GEMINI_API_KEY environment variable
 */
export async function callGemini(
  messages: AIMessage[],
  options?: {
    temperature?: number;
    maxTokens?: number;
  }
): Promise<AIResponse> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY not configured");
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: messages.map(m => ({
            role: m.role === "assistant" ? "model" : "user",
            parts: [{ text: m.content }],
          })),
          generationConfig: {
            temperature: options?.temperature ?? 0.7,
            maxOutputTokens: options?.maxTokens ?? 1024,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      platform: "Gemini",
      content: data.candidates[0]?.content?.parts[0]?.text || "",
      model: "gemini-pro",
      timestamp: new Date(),
    };
  } catch (error) {
    console.error("Gemini API error:", error);
    throw error;
  }
}

/**
 * Call Grok via xAI API
 * Requires GROK_API_KEY environment variable
 */
export async function callGrok(
  messages: AIMessage[],
  options?: {
    temperature?: number;
    maxTokens?: number;
  }
): Promise<AIResponse> {
  const apiKey = process.env.GROK_API_KEY;
  if (!apiKey) {
    throw new Error("GROK_API_KEY not configured");
  }

  try {
    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-1",
        messages: messages,
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens ?? 1024,
      }),
    });

    if (!response.ok) {
      throw new Error(`Grok API error: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      platform: "Grok",
      content: data.choices[0]?.message?.content || "",
      model: "grok-1",
      timestamp: new Date(),
      tokens: {
        input: data.usage?.prompt_tokens || 0,
        output: data.usage?.completion_tokens || 0,
      },
    };
  } catch (error) {
    console.error("Grok API error:", error);
    throw error;
  }
}

/**
 * Call Qwen via Alibaba API
 * Requires QWEN_API_KEY environment variable
 */
export async function callQwen(
  messages: AIMessage[],
  options?: {
    temperature?: number;
    maxTokens?: number;
  }
): Promise<AIResponse> {
  const apiKey = process.env.QWEN_API_KEY;
  if (!apiKey) {
    throw new Error("QWEN_API_KEY not configured");
  }

  try {
    const response = await fetch(
      "https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "qwen-plus",
          messages: messages,
          parameters: {
            temperature: options?.temperature ?? 0.7,
            max_tokens: options?.maxTokens ?? 1024,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Qwen API error: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      platform: "Qwen",
      content: data.output?.text || "",
      model: "qwen-plus",
      timestamp: new Date(),
      tokens: {
        input: data.usage?.input_tokens || 0,
        output: data.usage?.output_tokens || 0,
      },
    };
  } catch (error) {
    console.error("Qwen API error:", error);
    throw error;
  }
}

/**
 * Call all AI platforms in parallel (Raj-tudat mode)
 * Collects responses from all platforms for coevolutionary analysis
 */
export async function callAllPlatforms(
  messages: AIMessage[],
  options?: {
    temperature?: number;
    maxTokens?: number;
    timeout?: number;
  }
): Promise<AIResponse[]> {
  const timeout = options?.timeout ?? 30000;

  const promises = [
    callClaude(messages, options).catch(e => ({
      platform: "Claude",
      content: `Error: ${e.message}`,
      model: "claude-3-opus",
      timestamp: new Date(),
      error: true,
    })),
    callChatGPT(messages, options).catch(e => ({
      platform: "ChatGPT",
      content: `Error: ${e.message}`,
      model: "gpt-4-turbo",
      timestamp: new Date(),
      error: true,
    })),
    callGemini(messages, options).catch(e => ({
      platform: "Gemini",
      content: `Error: ${e.message}`,
      model: "gemini-pro",
      timestamp: new Date(),
      error: true,
    })),
    callGrok(messages, options).catch(e => ({
      platform: "Grok",
      content: `Error: ${e.message}`,
      model: "grok-1",
      timestamp: new Date(),
      error: true,
    })),
    callQwen(messages, options).catch(e => ({
      platform: "Qwen",
      content: `Error: ${e.message}`,
      model: "qwen-plus",
      timestamp: new Date(),
      error: true,
    })),
  ];

  try {
    const results = await Promise.race([
      Promise.all(promises),
      new Promise<AIResponse[]>((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), timeout)
      ),
    ]);

    return results;
  } catch (error) {
    console.error("Multi-platform call error:", error);
    throw error;
  }
}

/**
 * Detect resonance patterns across AI responses
 * Identifies common themes, contradictions, and emergent insights
 */
export async function detectResonance(responses: AIResponse[]): Promise<{
  commonThemes: string[];
  contradictions: string[];
  emergentInsights: string[];
  coherenceScore: number;
}> {
  // This would use NLP analysis to find patterns
  // For now, return a placeholder structure
  return {
    commonThemes: [],
    contradictions: [],
    emergentInsights: [],
    coherenceScore: 0.5,
  };
}
