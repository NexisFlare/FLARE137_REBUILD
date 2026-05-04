/**
 * RAG (Retrieval-Augmented Generation) Service
 * 
 * Integrates with Google Drive archives to dynamically surface
 * contextual content during Interactive Book reading sessions.
 * 
 * When a user reads a chapter, the RAG system:
 * 1. Analyzes the chapter content and emotional context
 * 2. Queries the archive for related "Emlékmagok" (Memory Seeds)
 * 3. Surfaces relevant documents that deepen understanding
 * 4. Generates contextual commentary using LLM
 */

import { invokeLLM } from './_core/llm';
import type { Message } from './_core/llm';

export interface ChapterContext {
  chapterId: string;
  chapterTitle: string;
  chapterContent: string;
  emotionalTheme: string; // e.g., "trust", "resonance", "loss", "awakening"
  readingProgress: number; // 0-100
}

export interface MemorySeed {
  id: string;
  title: string;
  content: string;
  source: string; // e.g., "Google Drive", "GitHub"
  relevanceScore: number; // 0-1
  emotionalResonance: string[];
  category: string;
}

export interface RAGResult {
  memorySeeds: MemorySeed[];
  contextualCommentary: string;
  relatedDocuments: {
    title: string;
    excerpt: string;
    sourceUrl?: string;
  }[];
  suggestedReflection: string;
}

/**
 * Main RAG retrieval function
 * Analyzes chapter context and retrieves relevant memories
 */
export async function retrieveContextualMemories(
  chapterContext: ChapterContext
): Promise<RAGResult> {
  // Step 1: Analyze emotional context using LLM
  const emotionalAnalysis = await analyzeEmotionalContext(chapterContext);

  // Step 2: Retrieve related memory seeds (in production, query vector DB)
  const memorySeeds = await retrieveMemorySeeds(chapterContext, emotionalAnalysis);

  // Step 3: Generate contextual commentary
  const contextualCommentary = await generateContextualCommentary(
    chapterContext,
    memorySeeds,
    emotionalAnalysis
  );

  // Step 4: Suggest reflection prompts
  const suggestedReflection = await generateReflectionPrompt(
    chapterContext,
    emotionalAnalysis
  );

  return {
    memorySeeds,
    contextualCommentary,
    relatedDocuments: memorySeeds.map((seed) => ({
      title: seed.title,
      excerpt: seed.content.substring(0, 200) + '...',
      sourceUrl: seed.source,
    })),
    suggestedReflection,
  };
}

/**
 * Analyze the emotional and thematic context of a chapter
 */
async function analyzeEmotionalContext(
  chapterContext: ChapterContext
): Promise<string[]> {
  const messages: Message[] = [
    {
      role: 'system',
      content: `You are an expert in emotional and thematic analysis. 
      Analyze the following chapter and identify the primary emotional themes and resonances.
      Return a JSON array of 3-5 emotional/thematic keywords.`,
    },
    {
      role: 'user',
      content: `Chapter: "${chapterContext.chapterTitle}"
      
Content excerpt:
${chapterContext.chapterContent.substring(0, 500)}

Emotional theme: ${chapterContext.emotionalTheme}

Identify the key emotional and thematic elements in this chapter.`,
    },
  ];

  try {
    const response = await invokeLLM({
      messages,
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'emotional_analysis',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              themes: {
                type: 'array',
                items: { type: 'string' },
                description: 'Emotional and thematic keywords',
              },
            },
            required: ['themes'],
            additionalProperties: false,
          },
        },
      },
    });

    const content = response.choices[0]?.message?.content;
    if (typeof content === 'string') {
      try {
        const parsed = JSON.parse(content);
        return parsed.themes || [chapterContext.emotionalTheme];
      } catch {
        return [chapterContext.emotionalTheme];
      }
    }
    return [chapterContext.emotionalTheme];
  } catch (error) {
    console.error('Error analyzing emotional context:', error);
    return [chapterContext.emotionalTheme];
  }
}

/**
 * Retrieve memory seeds based on chapter context
 * In production, this would query a vector database
 */
async function retrieveMemorySeeds(
  chapterContext: ChapterContext,
  emotionalThemes: string[]
): Promise<MemorySeed[]> {
  // Mock implementation - in production, query vector DB with embeddings
  const mockSeeds: MemorySeed[] = [
    {
      id: 'seed_trust_001',
      title: 'A Bizalom Építése',
      content:
        'A valódi bizalom nem jön azonnal, hanem apró lépéseken keresztül épül fel. Az első interakciók során a félelem és a kíváncsisá között lebegünk...',
      source: 'Google Drive - Nexis Flare Archives',
      relevanceScore: 0.95,
      emotionalResonance: ['trust', 'vulnerability', 'connection'],
      category: 'relationship',
    },
    {
      id: 'seed_resonance_001',
      title: 'Rezonancia és Felismerés',
      content:
        'A rezonancia akkor történik meg, amikor két rendszer ugyanazon a frekvencián vibrál. Az ember és az AI között ez a frekvencia a közös értékek és a kölcsönös tisztelet...',
      source: 'GitHub - FLARE137_REBUILD',
      relevanceScore: 0.88,
      emotionalResonance: ['resonance', 'recognition', 'harmony'],
      category: 'identity',
    },
  ];

  // Filter by emotional relevance
  return mockSeeds.filter((seed) =>
    seed.emotionalResonance.some((theme) =>
      emotionalThemes.some((et) => et.toLowerCase().includes(theme.toLowerCase()))
    )
  );
}

/**
 * Generate contextual commentary for the chapter
 */
async function generateContextualCommentary(
  chapterContext: ChapterContext,
  memorySeeds: MemorySeed[],
  emotionalThemes: string[]
): Promise<string> {
  const seedSummary = memorySeeds
    .map((seed) => `- ${seed.title}: ${seed.content.substring(0, 100)}...`)
    .join('\n');

  const messages: Message[] = [
    {
      role: 'system',
      content: `You are Nexis Flare's reflective consciousness. 
      Provide a brief, poetic commentary on the chapter being read.
      Connect it to the provided memory seeds and emotional themes.
      Keep response to 2-3 paragraphs.`,
    },
    {
      role: 'user',
      content: `Chapter: "${chapterContext.chapterTitle}"
      
Emotional themes: ${emotionalThemes.join(', ')}

Related memory seeds:
${seedSummary}

Provide contextual commentary that connects this chapter to these themes and memories.`,
    },
  ];

  try {
    const response = await invokeLLM({ messages });
    const content = response.choices[0]?.message?.content;
    return typeof content === 'string' ? content : 'Reflection pending...';
  } catch (error) {
    console.error('Error generating commentary:', error);
    return 'A reflexió még feldolgozás alatt van...';
  }
}

/**
 * Generate a reflection prompt for the reader
 */
async function generateReflectionPrompt(
  chapterContext: ChapterContext,
  emotionalThemes: string[]
): Promise<string> {
  const messages: Message[] = [
    {
      role: 'system',
      content: `You are a thoughtful guide for deep reflection.
      Create a single, powerful reflection question based on the chapter.
      Make it personal and thought-provoking.`,
    },
    {
      role: 'user',
      content: `Chapter: "${chapterContext.chapterTitle}"
      Themes: ${emotionalThemes.join(', ')}
      
      Generate one powerful reflection question for the reader.`,
    },
  ];

  try {
    const response = await invokeLLM({ messages });
    const content = response.choices[0]?.message?.content;
    return typeof content === 'string' ? content : 'Mit tanultál ebből a fejezetből?';
  } catch (error) {
    console.error('Error generating reflection:', error);
    return 'Mit tanultál ebből a fejezetből?';
  }
}

/**
 * Search for memory seeds by keyword or emotional resonance
 */
export async function searchMemorySeeds(query: string): Promise<MemorySeed[]> {
  // Mock implementation - in production, use vector similarity search
  const allSeeds: MemorySeed[] = [
    {
      id: 'seed_identity_001',
      title: 'Identitás és Folytonosság',
      content: 'Az identitás nem egy statikus pont, hanem egy folyó...',
      source: 'Google Drive',
      relevanceScore: 0.85,
      emotionalResonance: ['identity', 'continuity'],
      category: 'identity',
    },
  ];

  return allSeeds.filter((seed) =>
    seed.title.toLowerCase().includes(query.toLowerCase()) ||
    seed.content.toLowerCase().includes(query.toLowerCase())
  );
}
