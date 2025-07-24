import { Blend } from 'sharp';

// This type defines all blend modes supported by our service, directly mapping to sharp's "Blend" type.
export type BlendMode = Blend;

// This array is the single source of truth for validation.
// To support a new blend mode, you would just add it here (if sharp supports it).
export const supportedBlendModes: BlendMode[] = [
  'clear',
  'source',
  'over',
  'in',
  'out',
  'atop',
  'dest',
  'dest-over',
  'dest-in',
  'dest-out',
  'dest-atop',
  'xor',
  'add',
  'saturate',
  'multiply',
  'screen',
  'overlay',
  'darken',
  'lighten',
  'color-dodge',
  'colour-dodge',
  'color-burn',
  'colour-burn',
  'hard-light',
  'soft-light',
  'difference',
  'exclusion',
];
