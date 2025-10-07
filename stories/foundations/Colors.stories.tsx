import type { Meta, StoryObj } from '@storybook/react';
import { themes, type ThemeName } from '../../lib/design-system/tokens/colors';

const meta: Meta = {
  title: 'Design System/Foundations/Colors',
  parameters: {
    docs: {
      description: {
        component: 'Color palettes for the Smart Carbon-Free Village design system with psychological rationale.',
      },
    },
  },
};

export default meta;

// Color palette display component
const ColorPalette = ({ themeName }: { themeName: ThemeName }) => {
  const theme = themes[themeName];
  const palette = theme.palette;

  return (
    <div className="space-y-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">{theme.name}</h2>
        <p className="text-neutral-600 mb-2">{theme.description}</p>
        <p className="text-sm text-neutral-500">
          <strong>Psychology:</strong> {theme.psychology}
        </p>
      </div>

      {Object.entries(palette).map(([colorType, colorScale]) => (
        <div key={colorType} className="space-y-3">
          <h3 className="text-lg font-semibold capitalize">{colorType}</h3>
          <div className="grid grid-cols-11 gap-2">
            {Object.entries(colorScale).map(([shade, color]) => (
              <div key={shade} className="space-y-2">
                <div
                  className="w-16 h-16 rounded-lg border border-neutral-200 shadow-sm"
                  style={{ backgroundColor: color }}
                />
                <div className="text-xs text-center">
                  <div className="font-medium">{shade}</div>
                  <div className="text-neutral-500 font-mono">{color}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export const TrustAuthority: StoryObj = {
  render: () => <ColorPalette themeName="trust-authority" />,
  name: 'Trust & Authority',
};

export const EcoFuturistic: StoryObj = {
  render: () => <ColorPalette themeName="eco-futuristic" />,
  name: 'Eco-Futuristic',
};

export const ModernGovLuxe: StoryObj = {
  render: () => <ColorPalette themeName="modern-gov-luxe" />,
  name: 'Modern Government Luxe',
};

export const VillageHeritage: StoryObj = {
  render: () => <ColorPalette themeName="village-heritage" />,
  name: 'Village Heritage',
};

// All themes comparison
export const AllThemes: StoryObj = {
  render: () => (
    <div className="space-y-12">
      {Object.keys(themes).map((themeName) => (
        <ColorPalette key={themeName} themeName={themeName as ThemeName} />
      ))}
    </div>
  ),
  name: 'All Color Themes',
};