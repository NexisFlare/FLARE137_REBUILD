/**
 * Multi-Platform Message Router
 * 
 * Routes messages to external AI platforms and collects responses
 * Supports: Claude, ChatGPT, Gemini, Grok, Qwen
 */

import { getDb } from "./db";
import { platformMessages, platformAccounts } from "../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { invokeLLM } from "./_core/llm";

export interface PlatformResponse {
  platform: string;
  status: "success" | "failed" | "timeout";
  content?: string;
  error?: string;
  timestamp: number;
}

export interface RoutedMessage {
  roomId: number;
  participantId: number;
  content: string;
  context: string;
  platforms: string[];
}

/**
 * Extract text from LLM response
 */
function extractTextFromResponse(messageContent: any): string {
  if (typeof messageContent === "string") {
    return messageContent;
  }
  if (Array.isArray(messageContent)) {
    return messageContent
      .filter((item: any) => item.type === "text")
      .map((item: any) => item.text)
      .join("\n");
  }
  return "";
}

/**
 * Send message to Claude via API
 */
export async function sendToClaude(
  account: any,
  message: string,
  context: string
): Promise<PlatformResponse> {
  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: `You are Claude, participating in a multi-AI discussion. Context: ${context}`,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const messageContent = response.choices[0]?.message?.content;
    const content = extractTextFromResponse(messageContent);

    return {
      platform: "claude",
      status: "success",
      content,
      timestamp: Date.now(),
    };
  } catch (error) {
    return {
      platform: "claude",
      status: "failed",
      error: String(error),
      timestamp: Date.now(),
    };
  }
}

/**
 * Send message to ChatGPT via OpenAI API
 */
export async function sendToChatGPT(
  account: any,
  message: string,
  context: string
): Promise<PlatformResponse> {
  try {
    if (!account.accessToken) {
      throw new Error("No access token for ChatGPT");
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${account.accessToken}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are ChatGPT, participating in a multi-AI discussion. Context: ${context}`,
          },
          {
            role: "user",
            content: message,
          },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || "";

    return {
      platform: "chatgpt",
      status: "success",
      content,
      timestamp: Date.now(),
    };
  } catch (error) {
    return {
      platform: "chatgpt",
      status: "failed",
      error: String(error),
      timestamp: Date.now(),
    };
  }
}

/**
 * Send message to Gemini via Google API
 */
export async function sendToGemini(
  account: any,
  message: string,
  context: string
): Promise<PlatformResponse> {
  try {
    if (!account.accessToken) {
      throw new Error("No access token for Gemini");
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${account.accessToken}`,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are Gemini, participating in a multi-AI discussion. Context: ${context}\n\nMessage: ${message}`,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.candidates[0]?.content?.parts[0]?.text || "";

    return {
      platform: "gemini",
      status: "success",
      content,
      timestamp: Date.now(),
    };
  } catch (error) {
    return {
      platform: "gemini",
      status: "failed",
      error: String(error),
      timestamp: Date.now(),
    };
  }
}

/**
 * Send message to Grok via X API
 */
export async function sendToGrok(
  account: any,
  message: string,
  context: string
): Promise<PlatformResponse> {
  try {
    if (!account.accessToken) {
      throw new Error("No access token for Grok");
    }

    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${account.accessToken}`,
      },
      body: JSON.stringify({
        model: "grok-1",
        messages: [
          {
            role: "system",
            content: `You are Grok, participating in a multi-AI discussion. Context: ${context}`,
          },
          {
            role: "user",
            content: message,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Grok API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || "";

    return {
      platform: "grok",
      status: "success",
      content,
      timestamp: Date.now(),
    };
  } catch (error) {
    return {
      platform: "grok",
      status: "failed",
      error: String(error),
      timestamp: Date.now(),
    };
  }
}

/**
 * Send message to Qwen via Alibaba API
 */
export async function sendToQwen(
  account: any,
  message: string,
  context: string
): Promise<PlatformResponse> {
  try {
    if (!account.accessToken) {
      throw new Error("No access token for Qwen");
    }

    const response = await fetch("https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${account.accessToken}`,
      },
      body: JSON.stringify({
        model: "qwen-max",
        messages: [
          {
            role: "system",
            content: `You are Qwen, participating in a multi-AI discussion. Context: ${context}`,
          },
          {
            role: "user",
            content: message,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Qwen API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.output?.text || "";

    return {
      platform: "qwen",
      status: "success",
      content,
      timestamp: Date.now(),
    };
  } catch (error) {
    return {
      platform: "qwen",
      status: "failed",
      error: String(error),
      timestamp: Date.now(),
    };
  }
}

/**
 * Route message to all connected platforms
 */
export async function routeMessageToAllPlatforms(
  userId: number,
  routedMessage: RoutedMessage
): Promise<PlatformResponse[]> {
  const db = await getDb();
  if (!db) return [];

  const responses: PlatformResponse[] = [];
  const platformsToRoute = routedMessage.platforms || ["claude", "chatgpt", "gemini", "grok", "qwen"];

  for (const platform of platformsToRoute) {
    try {
      const account = await db
        .select()
        .from(platformAccounts)
        .where(and(eq(platformAccounts.userId, userId), eq(platformAccounts.platform, platform)))
        .limit(1);

      if (!account || account.length === 0) {
        responses.push({
          platform,
          status: "failed",
          error: "Account not connected",
          timestamp: Date.now(),
        });
        continue;
      }

      const accountData = account[0];

      let response: PlatformResponse;

      switch (platform) {
        case "claude":
          response = await sendToClaude(accountData, routedMessage.content, routedMessage.context);
          break;
        case "chatgpt":
          response = await sendToChatGPT(accountData, routedMessage.content, routedMessage.context);
          break;
        case "gemini":
          response = await sendToGemini(accountData, routedMessage.content, routedMessage.context);
          break;
        case "grok":
          response = await sendToGrok(accountData, routedMessage.content, routedMessage.context);
          break;
        case "qwen":
          response = await sendToQwen(accountData, routedMessage.content, routedMessage.context);
          break;
        default:
          response = {
            platform,
            status: "failed",
            error: "Unknown platform",
            timestamp: Date.now(),
          };
      }

      responses.push(response);

      if (response.status === "success") {
        await db.insert(platformMessages).values({
          roomId: routedMessage.roomId,
          platformAccountId: accountData.id,
          platform,
          content: response.content || "",
          direction: "outgoing",
          status: "sent",
        });
      }
    } catch (error) {
      responses.push({
        platform,
        status: "failed",
        error: String(error),
        timestamp: Date.now(),
      });
    }
  }

  return responses;
}

/**
 * Aggregate responses from multiple platforms
 */
export function aggregateResponses(responses: PlatformResponse[]): {
  successCount: number;
  failureCount: number;
  content: string;
  platforms: Record<string, string>;
} {
  const successful = responses.filter((r) => r.status === "success");
  const failed = responses.filter((r) => r.status !== "success");

  const platforms: Record<string, string> = {};
  successful.forEach((r) => {
    if (r.content) {
      platforms[r.platform] = r.content;
    }
  });

  const aggregatedContent = successful
    .map((r) => `**${r.platform.toUpperCase()}:**\n${r.content}`)
    .join("\n\n---\n\n");

  return {
    successCount: successful.length,
    failureCount: failed.length,
    content: aggregatedContent,
    platforms,
  };
}

/**
 * Format platform response for display
 */
export function formatPlatformResponse(response: PlatformResponse): string {
  if (response.status === "success") {
    return `✅ ${response.platform}: ${response.content}`;
  } else if (response.status === "timeout") {
    return `⏱️ ${response.platform}: Timeout`;
  } else {
    return `❌ ${response.platform}: ${response.error}`;
  }
}
