/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { coreEvents } from '@google/gemini-cli-core';
import { setupConsoleMocks } from '@google/gemini-cli-test-utils';

setupConsoleMocks();

// Increase max listeners to avoid warnings in large test suites
coreEvents.setMaxListeners(100);
