import type { Meta, StoryObj } from '@storybook/web-components';
import DetailsAnimated from "./index";

window.customElements.define("details-animated", DetailsAnimated);

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default  {
  title: 'Details Animated',
  render: (args) => `
    <details-animated>
      <details ${args.isOpen ? "open" : ""}>
        <summary>${args.summary}</summary>
        <p>${args.details}</p>
      </details>
    </details-animated>
    `,
} satisfies Meta

export const detailsAnimated: StoryObj = {
  args: {
    summary: "Learn latin here!",
    details: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    isOpen: false
  },
};
