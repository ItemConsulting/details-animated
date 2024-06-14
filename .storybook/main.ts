import type { StorybookConfig } from "@storybook/web-components-vite";

const config: StorybookConfig = {
  stories: [
    "../**/*.stories.ts",
  ],
  addons: [
    "@storybook/addon-essentials",
  ],
  framework: {
    name: "@storybook/web-components-vite",
    options: {},
  },
  core: {
    disableTelemetry: true,
  },
};
export default config;
