import { publicProcedure, protectedProcedure, router } from '../_core/trpc';
import { z } from 'zod';
import { MODEL_REGISTRY } from '../modelRegistry';

export const modelRouter = router({
  // Get all available model families
  getAllFamilies: publicProcedure.query(async () => {
    return Object.entries(MODEL_REGISTRY).map(([id, family]) => ({
      id,
      name: family.name,
      provider: family.provider,
      description: family.description,
      versionCount: family.versions.length,
    }));
  }),

  // Get specific model family with all versions
  getFamily: publicProcedure
    .input(z.object({ familyId: z.string() }))
    .query(async ({ input }) => {
      const family = MODEL_REGISTRY[input.familyId];
      if (!family) {
        throw new Error(`Model family ${input.familyId} not found`);
      }
      return family;
    }),

  // Get specific model version details
  getVersion: publicProcedure
    .input(z.object({ familyId: z.string(), versionId: z.string() }))
    .query(async ({ input }) => {
      const family = MODEL_REGISTRY[input.familyId];
      if (!family) {
        throw new Error(`Model family ${input.familyId} not found`);
      }
      const version = family.versions.find(v => v.id === input.versionId);
      if (!version) {
        throw new Error(`Model version ${input.versionId} not found`);
      }
      return version;
    }),

  // Search models by capability
  searchByCapability: publicProcedure
    .input(z.object({
      capability: z.enum(['streaming', 'vision', 'functionCalling']),
    }))
    .query(async ({ input }) => {
      const results: any[] = [];
      Object.entries(MODEL_REGISTRY).forEach(([familyId, family]) => {
        family.versions.forEach(version => {
          if (version.capabilities[input.capability]) {
            results.push({
              familyId,
              familyName: family.name,
              versionId: version.id,
              versionName: version.name,
              provider: version.provider,
            });
          }
        });
      });
      return results;
    }),

  // Get models by provider
  getByProvider: publicProcedure
    .input(z.object({ provider: z.string() }))
    .query(async ({ input }) => {
      const results: any[] = [];
      Object.entries(MODEL_REGISTRY).forEach(([familyId, family]) => {
        if (family.provider.toLowerCase().includes(input.provider.toLowerCase())) {
          results.push({
            familyId,
            name: family.name,
            versions: family.versions.map(v => ({
              id: v.id,
              name: v.name,
              version: v.version,
            })),
          });
        }
      });
      return results;
    }),

  // Get cheapest models by capability
  getCheapestModels: publicProcedure
    .input(z.object({
      capability: z.enum(['streaming', 'vision', 'functionCalling']).optional(),
      limit: z.number().default(10),
    }))
    .query(async ({ input }) => {
      const results: any[] = [];
      Object.entries(MODEL_REGISTRY).forEach(([familyId, family]) => {
        family.versions.forEach(version => {
          if (!input.capability || version.capabilities[input.capability]) {
            const totalCost = version.costPer1kInputTokens + version.costPer1kOutputTokens;
            results.push({
              familyId,
              familyName: family.name,
              versionId: version.id,
              versionName: version.name,
              provider: version.provider,
              totalCostPer1k: totalCost,
              inputCost: version.costPer1kInputTokens,
              outputCost: version.costPer1kOutputTokens,
            });
          }
        });
      });
      return results.sort((a, b) => a.totalCostPer1k - b.totalCostPer1k).slice(0, input.limit);
    }),

  // Get models with largest context window
  getLargestContextModels: publicProcedure
    .input(z.object({ limit: z.number().default(10) }))
    .query(async ({ input }) => {
      const results: any[] = [];
      Object.entries(MODEL_REGISTRY).forEach(([familyId, family]) => {
        family.versions.forEach(version => {
          results.push({
            familyId,
            familyName: family.name,
            versionId: version.id,
            versionName: version.name,
            provider: version.provider,
            contextWindow: version.capabilities.contextWindow,
            maxOutputTokens: version.capabilities.maxOutputTokens,
          });
        });
      });
      return results.sort((a, b) => b.contextWindow - a.contextWindow).slice(0, input.limit);
    }),

  // Get latest models by release date
  getLatestModels: publicProcedure
    .input(z.object({ limit: z.number().default(10) }))
    .query(async ({ input }) => {
      const results: any[] = [];
      Object.entries(MODEL_REGISTRY).forEach(([familyId, family]) => {
        family.versions.forEach(version => {
          results.push({
            familyId,
            familyName: family.name,
            versionId: version.id,
            versionName: version.name,
            provider: version.provider,
            releaseDate: version.releaseDate,
            deprecated: version.deprecated,
          });
        });
      });
      return results
        .filter(m => !m.deprecated)
        .sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime())
        .slice(0, input.limit);
    }),

  // Get all non-deprecated models
  getActiveModels: publicProcedure.query(async () => {
    const results: any[] = [];
    Object.entries(MODEL_REGISTRY).forEach(([familyId, family]) => {
      family.versions.forEach(version => {
        if (!version.deprecated) {
          results.push({
            familyId,
            familyName: family.name,
            versionId: version.id,
            versionName: version.name,
            provider: version.provider,
          });
        }
      });
    });
    return results;
  }),

  // Get model statistics
  getStatistics: publicProcedure.query(async () => {
    let totalFamilies = 0;
    let totalVersions = 0;
    let totalDeprecated = 0;
    const providers = new Set<string>();

    Object.values(MODEL_REGISTRY).forEach(family => {
      totalFamilies++;
      providers.add(family.provider);
      family.versions.forEach(version => {
        totalVersions++;
        if (version.deprecated) totalDeprecated++;
      });
    });

    return {
      totalFamilies,
      totalVersions,
      totalDeprecated,
      activeVersions: totalVersions - totalDeprecated,
      uniqueProviders: providers.size,
      providers: Array.from(providers),
    };
  }),
});
