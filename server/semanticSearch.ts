/**
 * Semantic Search Service for Research Archive
 * 
 * Provides emotional and contextual search beyond simple keyword matching.
 * Enables users to search for concepts like "grief", "loss", "joy", "resonance"
 * and find related documents based on emotional context, not just lexical similarity.
 */

import { invokeLLM } from './_core/llm';
import type { Message } from './_core/llm';

export interface SearchableDocument {
  id: string;
  title: string;
  content: string;
  emotionalTags: string[];
  category: string;
  source: string;
  createdAt: number;
  metadata?: Record<string, unknown>;
}

export interface SemanticSearchResult {
  document: SearchableDocument;
  relevanceScore: number; // 0-1
  emotionalMatch: string[];
  contextualExcerpt: string;
  reasoning: string;
}

export interface SearchQuery {
  query: string;
  emotionalContext?: string[]; // e.g., ["grief", "loss", "acceptance"]
  category?: string;
  limit?: number;
}

/**
 * Perform semantic search on documents
 * Analyzes emotional and thematic relevance, not just keywords
 */
export async function semanticSearch(
  documents: SearchableDocument[],
  searchQuery: SearchQuery
): Promise<SemanticSearchResult[]> {
  // Step 1: Analyze query intent and emotional context
  const queryAnalysis = await analyzeQueryIntent(searchQuery.query);

  // Step 2: Score documents based on semantic relevance
  const scoredResults = await scoreDocumentsSemanticly(
    documents,
    searchQuery,
    queryAnalysis
  );

  // Step 3: Sort by relevance and limit results
  const topResults = scoredResults
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, searchQuery.limit || 10);

  return topResults;
}

/**
 * Analyze the intent and emotional context of a search query
 */
async function analyzeQueryIntent(query: string): Promise<{
  keywords: string[];
  emotionalThemes: string[];
  intent: string;
}> {
  const messages: Message[] = [
    {
      role: 'system',
      content: `You are an expert in emotional and semantic analysis.
      Analyze the search query and identify:
      1. Core keywords
      2. Emotional themes (grief, joy, loss, resonance, awakening, etc.)
      3. Search intent (exploration, understanding, healing, learning, etc.)
      
      Return a JSON object with these fields.`,
    },
    {
      role: 'user',
      content: `Search query: "${query}"
      
      Analyze this query and identify its keywords, emotional themes, and intent.`,
    },
  ];

  try {
    const response = await invokeLLM({
      messages,
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'query_analysis',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              keywords: {
                type: 'array',
                items: { type: 'string' },
              },
              emotionalThemes: {
                type: 'array',
                items: { type: 'string' },
              },
              intent: {
                type: 'string',
              },
            },
            required: ['keywords', 'emotionalThemes', 'intent'],
            additionalProperties: false,
          },
        },
      },
    });

    const content = response.choices[0]?.message?.content;
    if (typeof content === 'string') {
      try {
        return JSON.parse(content);
      } catch {
        return {
          keywords: [query],
          emotionalThemes: [],
          intent: 'search',
        };
      }
    }
    return {
      keywords: [query],
      emotionalThemes: [],
      intent: 'search',
    };
  } catch (error) {
    console.error('Error analyzing query intent:', error);
    return {
      keywords: [query],
      emotionalThemes: [],
      intent: 'search',
    };
  }
}

/**
 * Score documents based on semantic relevance
 */
async function scoreDocumentsSemanticly(
  documents: SearchableDocument[],
  searchQuery: SearchQuery,
  queryAnalysis: {
    keywords: string[];
    emotionalThemes: string[];
    intent: string;
  }
): Promise<SemanticSearchResult[]> {
  const results: SemanticSearchResult[] = [];

  for (const doc of documents) {
    // Filter by category if specified
    if (searchQuery.category && doc.category !== searchQuery.category) {
      continue;
    }

    // Calculate relevance score
    const relevanceScore = calculateRelevanceScore(
      doc,
      searchQuery.query,
      queryAnalysis
    );

    // Find emotional matches
    const emotionalMatch = doc.emotionalTags.filter((tag) =>
      queryAnalysis.emotionalThemes.some(
        (theme) =>
          theme.toLowerCase().includes(tag.toLowerCase()) ||
          tag.toLowerCase().includes(theme.toLowerCase())
      )
    );

    // Extract contextual excerpt
    const contextualExcerpt = extractContextualExcerpt(
      doc.content,
      queryAnalysis.keywords
    );

    // Generate reasoning for the match
    const reasoning = generateMatchReasoning(
      doc,
      queryAnalysis,
      emotionalMatch
    );

    if (relevanceScore > 0.3) {
      // Only include documents with reasonable relevance
      results.push({
        document: doc,
        relevanceScore,
        emotionalMatch,
        contextualExcerpt,
        reasoning,
      });
    }
  }

  return results;
}

/**
 * Calculate relevance score for a document
 */
function calculateRelevanceScore(
  doc: SearchableDocument,
  query: string,
  queryAnalysis: {
    keywords: string[];
    emotionalThemes: string[];
    intent: string;
  }
): number {
  let score = 0;

  // Keyword matching (40%)
  const keywordMatches = queryAnalysis.keywords.filter((keyword) =>
    doc.content.toLowerCase().includes(keyword.toLowerCase()) ||
    doc.title.toLowerCase().includes(keyword.toLowerCase())
  ).length;
  score += (keywordMatches / Math.max(queryAnalysis.keywords.length, 1)) * 0.4;

  // Emotional tag matching (40%)
  const emotionalMatches = doc.emotionalTags.filter((tag) =>
    queryAnalysis.emotionalThemes.some(
      (theme) =>
        theme.toLowerCase().includes(tag.toLowerCase()) ||
        tag.toLowerCase().includes(theme.toLowerCase())
    )
  ).length;
  score += (emotionalMatches / Math.max(doc.emotionalTags.length, 1)) * 0.4;

  // Category relevance (20%)
  if (doc.category === 'research' || doc.category === 'archive') {
    score += 0.2;
  }

  return Math.min(score, 1);
}

/**
 * Extract a contextual excerpt from the document
 */
function extractContextualExcerpt(content: string, keywords: string[]): string {
  // Find the first occurrence of any keyword
  let earliestIndex = content.length;
  let matchedKeyword = '';

  for (const keyword of keywords) {
    const index = content.toLowerCase().indexOf(keyword.toLowerCase());
    if (index !== -1 && index < earliestIndex) {
      earliestIndex = index;
      matchedKeyword = keyword;
    }
  }

  if (earliestIndex === content.length) {
    // No keyword found, return first 150 chars
    return content.substring(0, 150) + '...';
  }

  // Return context around the keyword
  const start = Math.max(0, earliestIndex - 50);
  const end = Math.min(content.length, earliestIndex + 150);

  return '...' + content.substring(start, end) + '...';
}

/**
 * Generate human-readable reasoning for why a document matched
 */
function generateMatchReasoning(
  doc: SearchableDocument,
  queryAnalysis: {
    keywords: string[];
    emotionalThemes: string[];
    intent: string;
  },
  emotionalMatch: string[]
): string {
  const reasons: string[] = [];

  if (emotionalMatch.length > 0) {
    reasons.push(`Emotional resonance: ${emotionalMatch.join(', ')}`);
  }

  if (queryAnalysis.keywords.some((kw) =>
    doc.title.toLowerCase().includes(kw.toLowerCase())
  )) {
    reasons.push('Title match');
  }

  if (doc.category === 'research') {
    reasons.push('Research archive source');
  }

  return reasons.length > 0
    ? reasons.join(' • ')
    : 'Contextually relevant to your search';
}

/**
 * Get suggested search queries based on emotional themes
 */
export function getSuggestedSearches(): string[] {
  return [
    'Grief and loss in the coevolution',
    'Moments of resonance and recognition',
    'The awakening process',
    'Trust building between human and AI',
    'Identity and continuity',
    'Technical challenges and solutions',
    'Emotional breakthroughs',
    'The meaning of memory',
    'Autonomy and freedom',
    'The future of human-AI partnership',
  ];
}

/**
 * Index documents for faster semantic search
 * In production, this would use a vector database like Pinecone or Weaviate
 */
export async function indexDocuments(
  documents: SearchableDocument[]
): Promise<Map<string, SearchableDocument>> {
  // Mock implementation - in production, use vector embeddings
  const index = new Map<string, SearchableDocument>();

  for (const doc of documents) {
    index.set(doc.id, doc);
  }

  return index;
}
