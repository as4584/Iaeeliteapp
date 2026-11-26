/// <reference types="node" />
// Build 6 crashed at launch (dyld "Symbol not found" in ExpoFileSystem) because expo-file-system
// floated to 58.0.14, which is compiled against a newer expo-modules-core than this app ships.
// Keep it pinned to the version proven on device (build 4) until the whole SDK is upgraded together.
import { readFileSync } from 'fs';

import pkg from '../../../package.json';

const installed = (name: string): string => JSON.parse(readFileSync(`node_modules/${name}/package.json`, 'utf8')).version;

it('pins expo-file-system to the version that matches expo-modules-core', () => {
  expect((pkg.dependencies as Record<string, string>)['expo-file-system']).toBe('58.0.11');
  expect(installed('expo-file-system')).toBe('58.0.11');
  expect(installed('expo-modules-core')).toBe('58.0.26');
});
