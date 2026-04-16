/**
 * Vitest Setup File
 * Configures testing environment and global utilities
 */

import { expect, afterEach, vi } from "vitest";

// Clean up after each test
afterEach(() => {
  vi.clearAllMocks();
});
