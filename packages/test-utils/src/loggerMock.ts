/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { vi, beforeEach, afterEach, type SpyInstance } from 'vitest';
import { format } from 'node:util';

export function setupConsoleMocks() {
  let logSpy: SpyInstance;
  let warnSpy: SpyInstance;
  let errorSpy: SpyInstance;
  let debugSpy: SpyInstance;
  let infoSpy: SpyInstance;
  let traceSpy: SpyInstance;
  let actWarnings: Array<{ message: string; stack: string }> = [];

  beforeEach(() => {
    actWarnings = [];
    
    // Silence log and warn completely during tests to avoid noise
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    debugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});
    infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
    traceSpy = vi.spyOn(console, 'trace').mockImplementation(() => {});
    
    // Capture error output, but preserve React Act(...) warnings for test failures
    errorSpy = vi.spyOn(console, 'error').mockImplementation((...args) => {
      const firstArg = args[0];
      if (
        typeof firstArg === 'string' &&
        firstArg.includes('was not wrapped in act(...)')
      ) {
        const stackLines = (new Error().stack || '').split('\n');
        let lastReactFrameIndex = -1;
        for (let i = 0; i < stackLines.length; i++) {
          if (stackLines[i].includes('react-reconciler')) {
            lastReactFrameIndex = i;
          }
        }
        const relevantStack =
          lastReactFrameIndex !== -1
            ? stackLines.slice(lastReactFrameIndex + 1).join('\n')
            : stackLines.slice(1).join('\n');

        if (relevantStack.includes('OverflowContext.tsx')) {
          return;
        }

        actWarnings.push({
          message: format(...args),
          stack: relevantStack,
        });
      }
    });
  });

  afterEach(() => {
    logSpy?.mockRestore();
    warnSpy?.mockRestore();
    errorSpy?.mockRestore();
    debugSpy?.mockRestore();
    infoSpy?.mockRestore();
    traceSpy?.mockRestore();

    if (actWarnings.length > 0) {
      const messages = actWarnings
        .map(({ message, stack }) => `${message}\n${stack}`)
        .join('\n\n');
      throw new Error(`Failing test due to "act(...)" warnings:\n${messages}`);
    }
  });
}
