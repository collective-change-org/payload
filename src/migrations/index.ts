import * as migration_20250119_115407 from './20250119_115407';
import * as migration_20250119_123550 from './20250119_123550';

export const migrations = [
  {
    up: migration_20250119_115407.up,
    down: migration_20250119_115407.down,
    name: '20250119_115407',
  },
  {
    up: migration_20250119_123550.up,
    down: migration_20250119_123550.down,
    name: '20250119_123550'
  },
];
