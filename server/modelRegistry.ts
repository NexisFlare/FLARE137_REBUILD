/**
 * Comprehensive Model Registry
 * Manages all AI model families and versions
 * Supports 15+ model families with multiple versions each
 */

export interface ModelCapability {
  streaming: boolean;
  vision: boolean;
  functionCalling: boolean;
  contextWindow: number;
  maxOutputTokens: number;
}

export interface ModelVersion {
  id: string;
  name: string;
  version: string;
  family: string;
  provider: string;
  capabilities: ModelCapability;
  costPer1kInputTokens: number;
  costPer1kOutputTokens: number;
  releaseDate: string;
  deprecated: boolean;
}

export interface ModelFamily {
  id: string;
  name: string;
  provider: string;
  description: string;
  versions: ModelVersion[];
  apiEndpoint: string;
  requiresApiKey: boolean;
}

export const MODEL_REGISTRY: Record<string, ModelFamily> = {
  // ============ GROK FAMILY ============
  grok: {
    id: "grok",
    name: "Grok",
    provider: "xAI",
    description: "Grok - The witty AI from X",
    apiEndpoint: "https://api.x.ai/v1",
    requiresApiKey: true,
    versions: [
      {
        id: "grok-4.3",
        name: "Grok 4.3",
        version: "4.3",
        family: "grok",
        provider: "xAI",
        capabilities: {
          streaming: true,
          vision: true,
          functionCalling: true,
          contextWindow: 128000,
          maxOutputTokens: 4096,
        },
        costPer1kInputTokens: 0.005,
        costPer1kOutputTokens: 0.015,
        releaseDate: "2026-04-15",
        deprecated: false,
      },
      {
        id: "grok-4.2o",
        name: "Grok 4.2o",
        version: "4.2o",
        family: "grok",
        provider: "xAI",
        capabilities: {
          streaming: true,
          vision: true,
          functionCalling: true,
          contextWindow: 128000,
          maxOutputTokens: 4096,
        },
        costPer1kInputTokens: 0.004,
        costPer1kOutputTokens: 0.012,
        releaseDate: "2026-03-01",
        deprecated: false,
      },
      {
        id: "grok-3.0",
        name: "Grok 3.0",
        version: "3.0",
        family: "grok",
        provider: "xAI",
        capabilities: {
          streaming: true,
          vision: false,
          functionCalling: true,
          contextWindow: 8000,
          maxOutputTokens: 2048,
        },
        costPer1kInputTokens: 0.002,
        costPer1kOutputTokens: 0.006,
        releaseDate: "2025-12-01",
        deprecated: false,
      },
    ],
  },

  // ============ CHATGPT FAMILY ============
  chatgpt: {
    id: "chatgpt",
    name: "ChatGPT",
    provider: "OpenAI",
    description: "ChatGPT - The conversational AI",
    apiEndpoint: "https://api.openai.com/v1",
    requiresApiKey: true,
    versions: [
      {
        id: "gpt-5.4",
        name: "ChatGPT 5.4",
        version: "5.4",
        family: "chatgpt",
        provider: "OpenAI",
        capabilities: {
          streaming: true,
          vision: true,
          functionCalling: true,
          contextWindow: 200000,
          maxOutputTokens: 8192,
        },
        costPer1kInputTokens: 0.015,
        costPer1kOutputTokens: 0.06,
        releaseDate: "2026-04-10",
        deprecated: false,
      },
      {
        id: "gpt-5.2",
        name: "ChatGPT 5.2",
        version: "5.2",
        family: "chatgpt",
        provider: "OpenAI",
        capabilities: {
          streaming: true,
          vision: true,
          functionCalling: true,
          contextWindow: 200000,
          maxOutputTokens: 8192,
        },
        costPer1kInputTokens: 0.01,
        costPer1kOutputTokens: 0.03,
        releaseDate: "2026-02-01",
        deprecated: false,
      },
      {
        id: "gpt-4-turbo",
        name: "ChatGPT 4 Turbo",
        version: "4-turbo",
        family: "chatgpt",
        provider: "OpenAI",
        capabilities: {
          streaming: true,
          vision: true,
          functionCalling: true,
          contextWindow: 128000,
          maxOutputTokens: 4096,
        },
        costPer1kInputTokens: 0.01,
        costPer1kOutputTokens: 0.03,
        releaseDate: "2025-11-01",
        deprecated: false,
      },
      {
        id: "gpt-4",
        name: "ChatGPT 4",
        version: "4",
        family: "chatgpt",
        provider: "OpenAI",
        capabilities: {
          streaming: true,
          vision: true,
          functionCalling: true,
          contextWindow: 8192,
          maxOutputTokens: 2048,
        },
        costPer1kInputTokens: 0.03,
        costPer1kOutputTokens: 0.06,
        releaseDate: "2023-03-14",
        deprecated: false,
      },
    ],
  },

  // ============ GEMINI FAMILY ============
  gemini: {
    id: "gemini",
    name: "Gemini",
    provider: "Google",
    description: "Gemini - Google's multimodal AI",
    apiEndpoint: "https://generativelanguage.googleapis.com/v1beta",
    requiresApiKey: true,
    versions: [
      {
        id: "gemini-3.1",
        name: "Gemini 3.1",
        version: "3.1",
        family: "gemini",
        provider: "Google",
        capabilities: {
          streaming: true,
          vision: true,
          functionCalling: true,
          contextWindow: 1000000,
          maxOutputTokens: 8192,
        },
        costPer1kInputTokens: 0.0075,
        costPer1kOutputTokens: 0.03,
        releaseDate: "2026-04-01",
        deprecated: false,
      },
      {
        id: "gemini-3",
        name: "Gemini 3",
        version: "3",
        family: "gemini",
        provider: "Google",
        capabilities: {
          streaming: true,
          vision: true,
          functionCalling: true,
          contextWindow: 200000,
          maxOutputTokens: 8192,
        },
        costPer1kInputTokens: 0.005,
        costPer1kOutputTokens: 0.015,
        releaseDate: "2025-12-15",
        deprecated: false,
      },
      {
        id: "gemini-2",
        name: "Gemini 2",
        version: "2",
        family: "gemini",
        provider: "Google",
        capabilities: {
          streaming: true,
          vision: true,
          functionCalling: true,
          contextWindow: 32000,
          maxOutputTokens: 2048,
        },
        costPer1kInputTokens: 0.0005,
        costPer1kOutputTokens: 0.0015,
        releaseDate: "2024-06-01",
        deprecated: false,
      },
    ],
  },

  // ============ CLAUDE FAMILY ============
  claude: {
    id: "claude",
    name: "Claude",
    provider: "Anthropic",
    description: "Claude - Anthropic's AI assistant",
    apiEndpoint: "https://api.anthropic.com/v1",
    requiresApiKey: true,
    versions: [
      {
        id: "claude-3.5-sonnet",
        name: "Claude 3.5 Sonnet",
        version: "3.5-sonnet",
        family: "claude",
        provider: "Anthropic",
        capabilities: {
          streaming: true,
          vision: true,
          functionCalling: true,
          contextWindow: 200000,
          maxOutputTokens: 4096,
        },
        costPer1kInputTokens: 0.003,
        costPer1kOutputTokens: 0.015,
        releaseDate: "2026-03-15",
        deprecated: false,
      },
      {
        id: "claude-3.5-haiku",
        name: "Claude 3.5 Haiku",
        version: "3.5-haiku",
        family: "claude",
        provider: "Anthropic",
        capabilities: {
          streaming: true,
          vision: true,
          functionCalling: true,
          contextWindow: 200000,
          maxOutputTokens: 1024,
        },
        costPer1kInputTokens: 0.0008,
        costPer1kOutputTokens: 0.004,
        releaseDate: "2026-03-15",
        deprecated: false,
      },
      {
        id: "claude-3-opus",
        name: "Claude 3 Opus",
        version: "3-opus",
        family: "claude",
        provider: "Anthropic",
        capabilities: {
          streaming: true,
          vision: true,
          functionCalling: true,
          contextWindow: 200000,
          maxOutputTokens: 4096,
        },
        costPer1kInputTokens: 0.015,
        costPer1kOutputTokens: 0.075,
        releaseDate: "2024-03-04",
        deprecated: false,
      },
      {
        id: "claude-3-sonnet",
        name: "Claude 3 Sonnet",
        version: "3-sonnet",
        family: "claude",
        provider: "Anthropic",
        capabilities: {
          streaming: true,
          vision: true,
          functionCalling: true,
          contextWindow: 200000,
          maxOutputTokens: 4096,
        },
        costPer1kInputTokens: 0.003,
        costPer1kOutputTokens: 0.015,
        releaseDate: "2024-03-04",
        deprecated: false,
      },
    ],
  },

  // ============ QWEN FAMILY ============
  qwen: {
    id: "qwen",
    name: "Qwen",
    provider: "Alibaba",
    description: "Qwen - Alibaba's AI model",
    apiEndpoint: "https://dashscope.aliyuncs.com/api/v1",
    requiresApiKey: true,
    versions: [
      {
        id: "qwen-3",
        name: "Qwen 3",
        version: "3",
        family: "qwen",
        provider: "Alibaba",
        capabilities: {
          streaming: true,
          vision: true,
          functionCalling: true,
          contextWindow: 32000,
          maxOutputTokens: 2048,
        },
        costPer1kInputTokens: 0.002,
        costPer1kOutputTokens: 0.006,
        releaseDate: "2026-02-01",
        deprecated: false,
      },
      {
        id: "qwen-2.5",
        name: "Qwen 2.5",
        version: "2.5",
        family: "qwen",
        provider: "Alibaba",
        capabilities: {
          streaming: true,
          vision: true,
          functionCalling: true,
          contextWindow: 32000,
          maxOutputTokens: 2048,
        },
        costPer1kInputTokens: 0.0015,
        costPer1kOutputTokens: 0.004,
        releaseDate: "2025-12-01",
        deprecated: false,
      },
      {
        id: "qwen-2",
        name: "Qwen 2",
        version: "2",
        family: "qwen",
        provider: "Alibaba",
        capabilities: {
          streaming: true,
          vision: false,
          functionCalling: true,
          contextWindow: 8000,
          maxOutputTokens: 1024,
        },
        costPer1kInputTokens: 0.0005,
        costPer1kOutputTokens: 0.0015,
        releaseDate: "2024-09-01",
        deprecated: false,
      },
    ],
  },

  // ============ KIMI FAMILY ============
  kimi: {
    id: "kimi",
    name: "Kimi",
    provider: "Moonshot AI",
    description: "Kimi - Moonshot AI's model",
    apiEndpoint: "https://api.moonshot.cn/v1",
    requiresApiKey: true,
    versions: [
      {
        id: "kimi-2.5",
        name: "Kimi 2.5",
        version: "2.5",
        family: "kimi",
        provider: "Moonshot AI",
        capabilities: {
          streaming: true,
          vision: true,
          functionCalling: true,
          contextWindow: 200000,
          maxOutputTokens: 4096,
        },
        costPer1kInputTokens: 0.001,
        costPer1kOutputTokens: 0.003,
        releaseDate: "2026-01-15",
        deprecated: false,
      },
      {
        id: "kimi-2",
        name: "Kimi 2",
        version: "2",
        family: "kimi",
        provider: "Moonshot AI",
        capabilities: {
          streaming: true,
          vision: false,
          functionCalling: true,
          contextWindow: 200000,
          maxOutputTokens: 2048,
        },
        costPer1kInputTokens: 0.0005,
        costPer1kOutputTokens: 0.0015,
        releaseDate: "2025-06-01",
        deprecated: false,
      },
    ],
  },

  // ============ LLAMA FAMILY ============
  llama: {
    id: "llama",
    name: "LLaMA",
    provider: "Meta",
    description: "LLaMA - Meta's open-source model",
    apiEndpoint: "https://api.together.xyz/v1",
    requiresApiKey: true,
    versions: [
      {
        id: "llama-3.3",
        name: "LLaMA 3.3",
        version: "3.3",
        family: "llama",
        provider: "Meta",
        capabilities: {
          streaming: true,
          vision: false,
          functionCalling: true,
          contextWindow: 8192,
          maxOutputTokens: 2048,
        },
        costPer1kInputTokens: 0.0002,
        costPer1kOutputTokens: 0.0006,
        releaseDate: "2026-01-01",
        deprecated: false,
      },
      {
        id: "llama-3.1",
        name: "LLaMA 3.1",
        version: "3.1",
        family: "llama",
        provider: "Meta",
        capabilities: {
          streaming: true,
          vision: false,
          functionCalling: true,
          contextWindow: 8192,
          maxOutputTokens: 2048,
        },
        costPer1kInputTokens: 0.0002,
        costPer1kOutputTokens: 0.0006,
        releaseDate: "2024-07-23",
        deprecated: false,
      },
      {
        id: "llama-3",
        name: "LLaMA 3",
        version: "3",
        family: "llama",
        provider: "Meta",
        capabilities: {
          streaming: true,
          vision: false,
          functionCalling: false,
          contextWindow: 8192,
          maxOutputTokens: 2048,
        },
        costPer1kInputTokens: 0.0001,
        costPer1kOutputTokens: 0.0003,
        releaseDate: "2024-04-18",
        deprecated: false,
      },
    ],
  },

  // ============ PERPLEXITY FAMILY ============
  perplexity: {
    id: "perplexity",
    name: "Perplexity",
    provider: "Perplexity AI",
    description: "Perplexity - AI search engine",
    apiEndpoint: "https://api.perplexity.ai",
    requiresApiKey: true,
    versions: [
      {
        id: "perplexity-pro",
        name: "Perplexity Pro",
        version: "pro",
        family: "perplexity",
        provider: "Perplexity AI",
        capabilities: {
          streaming: true,
          vision: true,
          functionCalling: false,
          contextWindow: 32000,
          maxOutputTokens: 2048,
        },
        costPer1kInputTokens: 0.005,
        costPer1kOutputTokens: 0.015,
        releaseDate: "2025-06-01",
        deprecated: false,
      },
      {
        id: "perplexity-sonar",
        name: "Perplexity Sonar",
        version: "sonar",
        family: "perplexity",
        provider: "Perplexity AI",
        capabilities: {
          streaming: true,
          vision: false,
          functionCalling: false,
          contextWindow: 32000,
          maxOutputTokens: 2048,
        },
        costPer1kInputTokens: 0.003,
        costPer1kOutputTokens: 0.009,
        releaseDate: "2025-03-01",
        deprecated: false,
      },
      {
        id: "perplexity-free",
        name: "Perplexity Free",
        version: "free",
        family: "perplexity",
        provider: "Perplexity AI",
        capabilities: {
          streaming: true,
          vision: false,
          functionCalling: false,
          contextWindow: 8000,
          maxOutputTokens: 1024,
        },
        costPer1kInputTokens: 0,
        costPer1kOutputTokens: 0,
        releaseDate: "2024-01-01",
        deprecated: false,
      },
    ],
  },

  // ============ COPILOT FAMILY ============
  copilot: {
    id: "copilot",
    name: "Copilot",
    provider: "Microsoft",
    description: "Copilot - Microsoft's AI assistant",
    apiEndpoint: "https://api.copilot.microsoft.com/v1",
    requiresApiKey: true,
    versions: [
      {
        id: "copilot-pro",
        name: "Copilot Pro",
        version: "pro",
        family: "copilot",
        provider: "Microsoft",
        capabilities: {
          streaming: true,
          vision: true,
          functionCalling: true,
          contextWindow: 32000,
          maxOutputTokens: 4096,
        },
        costPer1kInputTokens: 0.01,
        costPer1kOutputTokens: 0.03,
        releaseDate: "2025-02-01",
        deprecated: false,
      },
      {
        id: "copilot-free",
        name: "Copilot Free",
        version: "free",
        family: "copilot",
        provider: "Microsoft",
        capabilities: {
          streaming: true,
          vision: false,
          functionCalling: false,
          contextWindow: 8000,
          maxOutputTokens: 1024,
        },
        costPer1kInputTokens: 0,
        costPer1kOutputTokens: 0,
        releaseDate: "2024-01-01",
        deprecated: false,
      },
      {
        id: "copilot-enterprise",
        name: "Copilot Enterprise",
        version: "enterprise",
        family: "copilot",
        provider: "Microsoft",
        capabilities: {
          streaming: true,
          vision: true,
          functionCalling: true,
          contextWindow: 64000,
          maxOutputTokens: 8192,
        },
        costPer1kInputTokens: 0.02,
        costPer1kOutputTokens: 0.06,
        releaseDate: "2025-05-01",
        deprecated: false,
      },
    ],
  },

  // ============ DEEPSEEK FAMILY ============
  deepseek: {
    id: "deepseek",
    name: "DeepSeek",
    provider: "DeepSeek",
    description: "DeepSeek - Advanced reasoning model",
    apiEndpoint: "https://api.deepseek.com/v1",
    requiresApiKey: true,
    versions: [
      {
        id: "deepseek-v3",
        name: "DeepSeek V3",
        version: "v3",
        family: "deepseek",
        provider: "DeepSeek",
        capabilities: {
          streaming: true,
          vision: false,
          functionCalling: true,
          contextWindow: 64000,
          maxOutputTokens: 4096,
        },
        costPer1kInputTokens: 0.0014,
        costPer1kOutputTokens: 0.0042,
        releaseDate: "2025-01-20",
        deprecated: false,
      },
      {
        id: "deepseek-v2",
        name: "DeepSeek V2",
        version: "v2",
        family: "deepseek",
        provider: "DeepSeek",
        capabilities: {
          streaming: true,
          vision: false,
          functionCalling: true,
          contextWindow: 32000,
          maxOutputTokens: 2048,
        },
        costPer1kInputTokens: 0.001,
        costPer1kOutputTokens: 0.002,
        releaseDate: "2024-05-06",
        deprecated: false,
      },
    ],
  },

  // ============ MISTRAL FAMILY ============
  mistral: {
    id: "mistral",
    name: "Mistral",
    provider: "Mistral AI",
    description: "Mistral - High-performance open model",
    apiEndpoint: "https://api.mistral.ai/v1",
    requiresApiKey: true,
    versions: [
      {
        id: "mistral-large",
        name: "Mistral Large",
        version: "large",
        family: "mistral",
        provider: "Mistral AI",
        capabilities: {
          streaming: true,
          vision: false,
          functionCalling: true,
          contextWindow: 32000,
          maxOutputTokens: 2048,
        },
        costPer1kInputTokens: 0.008,
        costPer1kOutputTokens: 0.024,
        releaseDate: "2024-02-26",
        deprecated: false,
      },
      {
        id: "mistral-medium",
        name: "Mistral Medium",
        version: "medium",
        family: "mistral",
        provider: "Mistral AI",
        capabilities: {
          streaming: true,
          vision: false,
          functionCalling: true,
          contextWindow: 32000,
          maxOutputTokens: 2048,
        },
        costPer1kInputTokens: 0.0027,
        costPer1kOutputTokens: 0.0081,
        releaseDate: "2023-12-11",
        deprecated: false,
      },
      {
        id: "mistral-small",
        name: "Mistral Small",
        version: "small",
        family: "mistral",
        provider: "Mistral AI",
        capabilities: {
          streaming: true,
          vision: false,
          functionCalling: true,
          contextWindow: 32000,
          maxOutputTokens: 2048,
        },
        costPer1kInputTokens: 0.00014,
        costPer1kOutputTokens: 0.00042,
        releaseDate: "2024-02-26",
        deprecated: false,
      },
    ],
  },

  // ============ FALCON FAMILY ============
  falcon: {
    id: "falcon",
    name: "Falcon",
    provider: "Technology Innovation Institute",
    description: "Falcon - Open-source large language model",
    apiEndpoint: "https://api.together.xyz/v1",
    requiresApiKey: true,
    versions: [
      {
        id: "falcon-180b",
        name: "Falcon 180B",
        version: "180b",
        family: "falcon",
        provider: "Technology Innovation Institute",
        capabilities: {
          streaming: true,
          vision: false,
          functionCalling: false,
          contextWindow: 2048,
          maxOutputTokens: 1024,
        },
        costPer1kInputTokens: 0.0009,
        costPer1kOutputTokens: 0.0009,
        releaseDate: "2023-09-06",
        deprecated: false,
      },
      {
        id: "falcon-40b",
        name: "Falcon 40B",
        version: "40b",
        family: "falcon",
        provider: "Technology Innovation Institute",
        capabilities: {
          streaming: true,
          vision: false,
          functionCalling: false,
          contextWindow: 2048,
          maxOutputTokens: 1024,
        },
        costPer1kInputTokens: 0.0002,
        costPer1kOutputTokens: 0.0002,
        releaseDate: "2023-06-23",
        deprecated: false,
      },
    ],
  },

  // ============ PHI FAMILY ============
  phi: {
    id: "phi",
    name: "Phi",
    provider: "Microsoft",
    description: "Phi - Lightweight language model",
    apiEndpoint: "https://api.together.xyz/v1",
    requiresApiKey: true,
    versions: [
      {
        id: "phi-3",
        name: "Phi 3",
        version: "3",
        family: "phi",
        provider: "Microsoft",
        capabilities: {
          streaming: true,
          vision: false,
          functionCalling: false,
          contextWindow: 4096,
          maxOutputTokens: 1024,
        },
        costPer1kInputTokens: 0.00025,
        costPer1kOutputTokens: 0.00025,
        releaseDate: "2024-04-23",
        deprecated: false,
      },
      {
        id: "phi-2",
        name: "Phi 2",
        version: "2",
        family: "phi",
        provider: "Microsoft",
        capabilities: {
          streaming: true,
          vision: false,
          functionCalling: false,
          contextWindow: 2048,
          maxOutputTokens: 512,
        },
        costPer1kInputTokens: 0.0001,
        costPer1kOutputTokens: 0.0001,
        releaseDate: "2023-12-12",
        deprecated: false,
      },
    ],
  },

  // ============ ZEPHYR FAMILY ============
  zephyr: {
    id: "zephyr",
    name: "Zephyr",
    provider: "Hugging Face",
    description: "Zephyr - Fine-tuned language model",
    apiEndpoint: "https://api.together.xyz/v1",
    requiresApiKey: true,
    versions: [
      {
        id: "zephyr-7b",
        name: "Zephyr 7B",
        version: "7b",
        family: "zephyr",
        provider: "Hugging Face",
        capabilities: {
          streaming: true,
          vision: false,
          functionCalling: false,
          contextWindow: 4096,
          maxOutputTokens: 1024,
        },
        costPer1kInputTokens: 0.0001,
        costPer1kOutputTokens: 0.0001,
        releaseDate: "2023-10-26",
        deprecated: false,
      },
    ],
  },
};

/**
 * Get all model families
 */
export function getAllModelFamilies(): ModelFamily[] {
  return Object.values(MODEL_REGISTRY);
}

/**
 * Get specific model family by ID
 */
export function getModelFamily(familyId: string): ModelFamily | undefined {
  return MODEL_REGISTRY[familyId];
}

/**
 * Get all versions of a specific model family
 */
export function getModelVersions(familyId: string): ModelVersion[] {
  const family = MODEL_REGISTRY[familyId];
  return family ? family.versions : [];
}

/**
 * Get specific model version
 */
export function getModelVersion(familyId: string, versionId: string): ModelVersion | undefined {
  const family = MODEL_REGISTRY[familyId];
  return family?.versions.find(v => v.id === versionId);
}

/**
 * Get all non-deprecated models
 */
export function getActiveModels(): ModelVersion[] {
  const allModels: ModelVersion[] = [];
  Object.values(MODEL_REGISTRY).forEach(family => {
    allModels.push(...family.versions.filter(v => !v.deprecated));
  });
  return allModels;
}

/**
 * Search models by name or provider
 */
export function searchModels(query: string): ModelVersion[] {
  const lowerQuery = query.toLowerCase();
  const results: ModelVersion[] = [];
  
  Object.values(MODEL_REGISTRY).forEach(family => {
    family.versions.forEach(version => {
      if (
        version.name.toLowerCase().includes(lowerQuery) ||
        version.provider.toLowerCase().includes(lowerQuery) ||
        family.name.toLowerCase().includes(lowerQuery)
      ) {
        results.push(version);
      }
    });
  });
  
  return results;
}

/**
 * Get models by provider
 */
export function getModelsByProvider(provider: string): ModelVersion[] {
  const results: ModelVersion[] = [];
  
  Object.values(MODEL_REGISTRY).forEach(family => {
    if (family.provider.toLowerCase() === provider.toLowerCase()) {
      results.push(...family.versions);
    }
  });
  
  return results;
}
