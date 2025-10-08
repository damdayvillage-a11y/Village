import type { Preview } from '@storybook/nextjs';
import '../src/app/globals.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // Background and viewport configuration will be simpler without the addons
  },
  globalTypes: {
    theme: {
      description: 'Design System Theme',
      defaultValue: 'trust-authority',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: 'trust-authority', title: 'Trust & Authority' },
          { value: 'eco-futuristic', title: 'Eco-Futuristic' },
          { value: 'modern-gov-luxe', title: 'Modern Gov Luxe' },
          { value: 'village-heritage', title: 'Village Heritage' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme || 'trust-authority';
      return (
        <div className={`theme-${theme}`}>
          <Story />
        </div>
      );
    },
  ],
};

export default preview;