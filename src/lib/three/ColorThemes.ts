/**
 * Color themes for Three.js background animations
 * Each theme provides colors for background, particles, shapes, and fog
 */

export interface ColorTheme {
  name: string;
  background: number;
  particles: number[];
  shapes: number;
  fog: number;
}

export const ColorThemes: Record<string, ColorTheme> = {
  government: {
    name: 'Government',
    background: 0x0a3d62, // Deep navy blue - professional government color
    particles: [0xff9933, 0xffffff, 0x138808, 0x000080], // Saffron, White, Green, Navy (Indian tricolor inspired)
    shapes: 0x138808,
    fog: 0x1a4d72,
  },
  nature: {
    name: 'Nature',
    background: 0x0a4d3c,
    particles: [0x10b981, 0x34d399, 0x6ee7b7],
    shapes: 0x047857,
    fog: 0x064e3b,
  },
  tech: {
    name: 'Tech',
    background: 0x0f172a,
    particles: [0x3b82f6, 0x60a5fa, 0x93c5fd],
    shapes: 0x1e40af,
    fog: 0x1e293b,
  },
  sunset: {
    name: 'Sunset',
    background: 0x7c2d12,
    particles: [0xf97316, 0xfb923c, 0xfdba74],
    shapes: 0xea580c,
    fog: 0x9a3412,
  },
  night: {
    name: 'Night',
    background: 0x1e1b4b,
    particles: [0x6366f1, 0x818cf8, 0xa5b4fc],
    shapes: 0x4338ca,
    fog: 0x312e81,
  },
};

export function getTheme(name: string): ColorTheme {
  return ColorThemes[name] || ColorThemes.government;
}
