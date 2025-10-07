import type { Meta, StoryObj } from '@storybook/react';
import { textStyles, fontFamilies, fontSizes, fontWeights } from '../../lib/design-system/tokens/typography';

const meta: Meta = {
  title: 'Design System/Foundations/Typography',
  parameters: {
    docs: {
      description: {
        component: 'Typography system including font families, sizes, weights, and predefined text styles.',
      },
    },
  },
};

export default meta;

// Typography showcase component
const TypographyShowcase = () => {
  return (
    <div className="space-y-12">
      {/* Font Families */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Font Families</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Sans (Inter)</h3>
            <p style={{ fontFamily: fontFamilies.sans.join(', ') }} className="text-lg">
              The quick brown fox jumps over the lazy dog. 1234567890
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Display (Playfair Display)</h3>
            <p style={{ fontFamily: fontFamilies.display.join(', ') }} className="text-lg">
              The quick brown fox jumps over the lazy dog. 1234567890
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Serif (Charter)</h3>
            <p style={{ fontFamily: fontFamilies.serif.join(', ') }} className="text-lg">
              The quick brown fox jumps over the lazy dog. 1234567890
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Mono (JetBrains Mono)</h3>
            <p style={{ fontFamily: fontFamilies.mono.join(', ') }} className="text-lg">
              The quick brown fox jumps over the lazy dog. 1234567890
            </p>
          </div>
        </div>
      </section>

      {/* Font Sizes */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Font Sizes</h2>
        <div className="space-y-3">
          {Object.entries(fontSizes).map(([size, value]) => (
            <div key={size} className="flex items-baseline gap-4">
              <div className="w-16 text-sm text-neutral-500 font-mono">{size}</div>
              <div className="w-20 text-sm text-neutral-500 font-mono">{value}</div>
              <div style={{ fontSize: value }} className="font-sans">
                Sample Text
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Font Weights */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Font Weights</h2>
        <div className="space-y-3">
          {Object.entries(fontWeights).map(([weight, value]) => (
            <div key={weight} className="flex items-center gap-4">
              <div className="w-24 text-sm text-neutral-500 font-mono">{weight}</div>
              <div className="w-16 text-sm text-neutral-500 font-mono">{value}</div>
              <div style={{ fontWeight: value }} className="text-lg font-sans">
                Sample Text
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

// Text styles showcase
const TextStylesShowcase = () => {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold mb-6">Text Styles</h2>
      
      {/* Display Styles */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Display Styles</h3>
        <div className="space-y-4">
          {Object.entries(textStyles)
            .filter(([name]) => name.startsWith('display-'))
            .map(([styleName, style]) => (
              <div key={styleName}>
                <div className="text-sm text-neutral-500 mb-1 font-mono">{styleName}</div>
                <div
                  style={{
                    fontSize: style.fontSize,
                    lineHeight: style.lineHeight,
                    letterSpacing: style.letterSpacing,
                    fontWeight: style.fontWeight,
                  }}
                  className="font-display"
                >
                  Smart Carbon-Free Village
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* Heading Styles */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Heading Styles</h3>
        <div className="space-y-4">
          {Object.entries(textStyles)
            .filter(([name]) => name.startsWith('heading-'))
            .map(([styleName, style]) => (
              <div key={styleName}>
                <div className="text-sm text-neutral-500 mb-1 font-mono">{styleName}</div>
                <div
                  style={{
                    fontSize: style.fontSize,
                    lineHeight: style.lineHeight,
                    letterSpacing: style.letterSpacing,
                    fontWeight: style.fontWeight,
                  }}
                  className="font-display"
                >
                  Building a Sustainable Future
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* Body Styles */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Body Styles</h3>
        <div className="space-y-4">
          {Object.entries(textStyles)
            .filter(([name]) => name.startsWith('body-'))
            .map(([styleName, style]) => (
              <div key={styleName}>
                <div className="text-sm text-neutral-500 mb-1 font-mono">{styleName}</div>
                <div
                  style={{
                    fontSize: style.fontSize,
                    lineHeight: style.lineHeight,
                    letterSpacing: style.letterSpacing,
                    fontWeight: style.fontWeight,
                  }}
                  className="font-sans"
                >
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </div>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
};

export const FontFamilies: StoryObj = {
  render: () => <TypographyShowcase />,
  name: 'Font Families & Sizes',
};

export const TextStyles: StoryObj = {
  render: () => <TextStylesShowcase />,
  name: 'Text Styles',
};