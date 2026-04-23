import { describe, it, expect, beforeAll } from 'vitest';
import { modelRouter } from './modelRouter';
import { MODEL_REGISTRY } from '../modelRegistry';

describe('modelRouter', () => {
  let caller: any;

  beforeAll(async () => {
    // Create a test caller for the router
    caller = modelRouter.createCaller({
      user: null,
      req: {} as any,
      res: {} as any,
    } as any);
  });

  describe('getAllFamilies', () => {
    it('should return all model families', async () => {
      const families = await caller.getAllFamilies();
      expect(Array.isArray(families)).toBe(true);
      expect(families.length).toBeGreaterThan(0);
      
      // Check structure
      families.forEach(family => {
        expect(family).toHaveProperty('id');
        expect(family).toHaveProperty('name');
        expect(family).toHaveProperty('provider');
        expect(family).toHaveProperty('versionCount');
        expect(typeof family.versionCount).toBe('number');
      });
    });

    it('should have correct family count', async () => {
      const families = await caller.getAllFamilies();
      const registryCount = Object.keys(MODEL_REGISTRY).length;
      expect(families.length).toBe(registryCount);
    });
  });

  describe('getFamily', () => {
    it('should return a specific family', async () => {
      const family = await caller.getFamily({ familyId: 'grok' });
      expect(family).toBeDefined();
      expect(family.name).toBe('Grok');
      expect(Array.isArray(family.versions)).toBe(true);
    });

    it('should throw error for non-existent family', async () => {
      try {
        await caller.getFamily({ familyId: 'non-existent' });
        expect.fail('Should have thrown error');
      } catch (error: any) {
        expect(error.message).toContain('not found');
      }
    });
  });

  describe('getVersion', () => {
    it('should return a specific model version', async () => {
      const version = await caller.getVersion({
        familyId: 'grok',
        versionId: 'grok-4.3',
      });
      expect(version).toBeDefined();
      expect(version.name).toBe('Grok 4.3');
      expect(version.capabilities).toBeDefined();
    });

    it('should throw error for non-existent version', async () => {
      try {
        await caller.getVersion({
          familyId: 'grok',
          versionId: 'non-existent',
        });
        expect.fail('Should have thrown error');
      } catch (error: any) {
        expect(error.message).toContain('not found');
      }
    });
  });

  describe('searchByCapability', () => {
    it('should find models with streaming capability', async () => {
      const results = await caller.searchByCapability({ capability: 'streaming' });
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeGreaterThan(0);
      
      results.forEach(result => {
        expect(result).toHaveProperty('familyId');
        expect(result).toHaveProperty('versionId');
        expect(result).toHaveProperty('familyName');
      });
    });

    it('should find models with vision capability', async () => {
      const results = await caller.searchByCapability({ capability: 'vision' });
      expect(Array.isArray(results)).toBe(true);
    });
  });

  describe('getByProvider', () => {
    it('should return models by provider', async () => {
      const results = await caller.getByProvider({ provider: 'OpenAI' });
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeGreaterThan(0);
    });

    it('should be case-insensitive', async () => {
      const results1 = await caller.getByProvider({ provider: 'openai' });
      const results2 = await caller.getByProvider({ provider: 'OpenAI' });
      expect(results1.length).toBe(results2.length);
    });
  });

  describe('getCheapestModels', () => {
    it('should return cheapest models sorted by cost', async () => {
      const results = await caller.getCheapestModels({ limit: 5 });
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeLessThanOrEqual(5);
      
      // Check sorting
      for (let i = 1; i < results.length; i++) {
        expect(results[i].totalCostPer1k).toBeGreaterThanOrEqual(results[i - 1].totalCostPer1k);
      }
    });

    it('should filter by capability if provided', async () => {
      const results = await caller.getCheapestModels({
        capability: 'vision',
        limit: 5,
      });
      expect(Array.isArray(results)).toBe(true);
    });
  });

  describe('getLargestContextModels', () => {
    it('should return models with largest context windows', async () => {
      const results = await caller.getLargestContextModels({ limit: 5 });
      expect(Array.isArray(results)).toBe(true);
      
      // Check sorting
      for (let i = 1; i < results.length; i++) {
        expect(results[i].contextWindow).toBeLessThanOrEqual(results[i - 1].contextWindow);
      }
    });
  });

  describe('getLatestModels', () => {
    it('should return latest non-deprecated models', async () => {
      const results = await caller.getLatestModels({ limit: 5 });
      expect(Array.isArray(results)).toBe(true);
      
      // Check that no deprecated models are included
      results.forEach(result => {
        expect(result.deprecated).toBe(false);
      });
    });
  });

  describe('getActiveModels', () => {
    it('should return only non-deprecated models', async () => {
      const results = await caller.getActiveModels();
      expect(Array.isArray(results)).toBe(true);
      
      results.forEach(result => {
        expect(result).toHaveProperty('familyId');
        expect(result).toHaveProperty('versionId');
      });
    });
  });

  describe('getStatistics', () => {
    it('should return model statistics', async () => {
      const stats = await caller.getStatistics();
      expect(stats).toHaveProperty('totalFamilies');
      expect(stats).toHaveProperty('totalVersions');
      expect(stats).toHaveProperty('totalDeprecated');
      expect(stats).toHaveProperty('activeVersions');
      expect(stats).toHaveProperty('uniqueProviders');
      expect(stats).toHaveProperty('providers');
      
      expect(typeof stats.totalFamilies).toBe('number');
      expect(typeof stats.totalVersions).toBe('number');
      expect(stats.totalFamilies).toBeGreaterThan(0);
      expect(stats.totalVersions).toBeGreaterThan(0);
      expect(Array.isArray(stats.providers)).toBe(true);
    });

    it('should have correct active versions count', async () => {
      const stats = await caller.getStatistics();
      expect(stats.activeVersions).toBe(stats.totalVersions - stats.totalDeprecated);
    });
  });
});
