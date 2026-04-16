/**
 * Platform Account Management Service
 * 
 * Handles OAuth, token management, and API integration for:
 * - Claude (Anthropic)
 * - ChatGPT (OpenAI)
 * - Gemini (Google)
 * - Grok (X)
 * - GitHub
 * - Google Drive
 */

import { getDb } from "./db";
import { platformAccounts } from "../drizzle/schema";
import { eq, and } from "drizzle-orm";

export interface PlatformConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes: string[];
  tokenEndpoint: string;
  authEndpoint: string;
}

export const PLATFORM_CONFIGS: Record<string, Partial<PlatformConfig>> = {
  claude: {
    // Claude uses API key authentication
    tokenEndpoint: "https://api.anthropic.com/v1/messages",
  },
  chatgpt: {
    // ChatGPT uses OpenAI API
    tokenEndpoint: "https://api.openai.com/v1/chat/completions",
  },
  gemini: {
    // Gemini uses Google OAuth
    authEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenEndpoint: "https://oauth2.googleapis.com/token",
    scopes: ["https://www.googleapis.com/auth/generative-language"],
  },
  grok: {
    // Grok uses X/Twitter OAuth
    authEndpoint: "https://twitter.com/i/oauth2/authorize",
    tokenEndpoint: "https://twitter.com/2/oauth2/token",
    scopes: ["tweet.read", "tweet.write", "users.read"],
  },
  github: {
    // GitHub OAuth
    authEndpoint: "https://github.com/login/oauth/authorize",
    tokenEndpoint: "https://github.com/login/oauth/access_token",
    scopes: ["repo", "user"],
  },
  google: {
    // Google OAuth for Drive/Gmail
    authEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenEndpoint: "https://oauth2.googleapis.com/token",
    scopes: ["https://www.googleapis.com/auth/drive", "https://www.googleapis.com/auth/gmail.readonly"],
  },
};

/**
 * Link a platform account to a user
 */
export async function linkPlatformAccount(
  userId: number,
  platform: string,
  accountId: string,
  accessToken: string,
  refreshToken?: string,
  email?: string,
  displayName?: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(platformAccounts).values({
    userId,
    platform,
    accountId,
    accessToken,
    refreshToken: refreshToken || null,
    email: email || null,
    displayName: displayName || null,
    isConnected: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return result;
}

/**
 * Get platform account for user
 */
export async function getPlatformAccount(userId: number, platform: string) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(platformAccounts)
    .where(and(eq(platformAccounts.userId, userId), eq(platformAccounts.platform, platform)))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

/**
 * Get all platform accounts for user
 */
export async function getUserPlatformAccounts(userId: number) {
  const db = await getDb();
  if (!db) return [];

  const result = await db
    .select()
    .from(platformAccounts)
    .where(eq(platformAccounts.userId, userId));

  return result;
}

/**
 * Update platform account token
 */
export async function updatePlatformToken(
  accountId: number,
  accessToken: string,
  refreshToken?: string,
  expiresAt?: Date
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .update(platformAccounts)
    .set({
      accessToken,
      refreshToken: refreshToken || undefined,
      tokenExpiresAt: expiresAt || undefined,
      updatedAt: new Date(),
    })
    .where(eq(platformAccounts.id, accountId));

  return result;
}

/**
 * Disconnect platform account
 */
export async function disconnectPlatformAccount(userId: number, platform: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .update(platformAccounts)
    .set({
      isConnected: 0,
      updatedAt: new Date(),
    })
    .where(and(eq(platformAccounts.userId, userId), eq(platformAccounts.platform, platform)));

  return result;
}

/**
 * Check if token needs refresh
 */
export function isTokenExpired(account: any): boolean {
  if (!account.tokenExpiresAt) return false;
  return new Date() > new Date(account.tokenExpiresAt);
}

/**
 * Get OAuth authorization URL
 */
export function getOAuthUrl(
  platform: string,
  clientId: string,
  redirectUri: string,
  state: string
): string {
  const config = PLATFORM_CONFIGS[platform];
  if (!config.authEndpoint) {
    throw new Error(`OAuth not supported for platform: ${platform}`);
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    state,
    scope: config.scopes?.join(" ") || "",
  });

  return `${config.authEndpoint}?${params.toString()}`;
}

/**
 * Exchange OAuth code for tokens
 */
export async function exchangeOAuthCode(
  platform: string,
  code: string,
  clientId: string,
  clientSecret: string,
  redirectUri: string
): Promise<{
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
}> {
  const config = PLATFORM_CONFIGS[platform];
  if (!config.tokenEndpoint) {
    throw new Error(`Token exchange not supported for platform: ${platform}`);
  }

  const response = await fetch(config.tokenEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
    }).toString(),
  });

  if (!response.ok) {
    throw new Error(`Token exchange failed: ${response.statusText}`);
  }

  const data = await response.json();

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in,
  };
}

/**
 * Refresh OAuth token
 */
export async function refreshOAuthToken(
  platform: string,
  refreshToken: string,
  clientId: string,
  clientSecret: string
): Promise<{
  accessToken: string;
  expiresIn?: number;
}> {
  const config = PLATFORM_CONFIGS[platform];
  if (!config.tokenEndpoint) {
    throw new Error(`Token refresh not supported for platform: ${platform}`);
  }

  const response = await fetch(config.tokenEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
    }).toString(),
  });

  if (!response.ok) {
    throw new Error(`Token refresh failed: ${response.statusText}`);
  }

  const data = await response.json();

  return {
    accessToken: data.access_token,
    expiresIn: data.expires_in,
  };
}

/**
 * Get valid access token (refresh if needed)
 */
export async function getValidAccessToken(
  account: any,
  clientId: string,
  clientSecret: string
): Promise<string> {
  if (!isTokenExpired(account)) {
    return account.accessToken;
  }

  if (!account.refreshToken) {
    throw new Error("Token expired and no refresh token available");
  }

  const refreshed = await refreshOAuthToken(
    account.platform,
    account.refreshToken,
    clientId,
    clientSecret
  );

  // Update token in database
  await updatePlatformToken(account.id, refreshed.accessToken);

  return refreshed.accessToken;
}
