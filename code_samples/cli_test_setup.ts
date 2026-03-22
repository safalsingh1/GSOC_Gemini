/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { vi, beforeEach, afterEach } from 'vitest';
import { format } from 'node:util';
import { coreEvents } from '@google/gemini-cli-core';
import { themeManager } from './src/ui/themes/theme-manager.js';

// Unset CI environment variable so that ink renders dynamically as it does in a real terminal
if (process.env.CI !== undefined) {
  delete process.env.CI;
}

global.IS_REACT_ACT_ENVIRONMENT = true;

// Increase max listeners to avoid warnings in large test suites
coreEvents.setMaxListeners(100);

// Unset NO_COLOR environment variable to ensure consistent theme behavior between local and CI test runs
if (process.env.NO_COLOR !== undefined) {
  delete process.env.NO_COLOR;
}

// Force true color output for ink so that snapshots always include color information.
process.env.FORCE_COLOR = '3';

// Force generic keybinding hints to ensure stable snapshots across different operating systems.
process.env.FORCE_GENERIC_KEYBINDING_HINTS = 'true';

import './src/test-utils/customMatchers.js';

import { setupConsoleMocks } from '@google/gemini-cli-test-utils';

setupConsoleMocks();

beforeEach(() => {
  // Reset themeManager state to ensure test isolation
  themeManager.resetForTesting();
});

afterEach(() => {
  vi.unstubAllEnvs();
});
