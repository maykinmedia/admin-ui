const { getStoryContext } = require("@storybook/test-runner");
const { MINIMAL_VIEWPORTS } = require("@storybook/addon-viewport");

const DEFAULT_VP_SIZE = { width: 1280, height: 720 };

module.exports = {
  /**
   * This makes sure the test runner respects the viewport.
   * @see {@link https://github.com/storybookjs/test-runner/issues/85#issuecomment-1576465128|[Bug] Tests always run in the default viewport}
   * @param page
   * @param story
   */
  async preRender(page, story) {
    const context = await getStoryContext(page, story);
    const vpName =
      context.parameters?.viewport?.defaultViewport ?? "responsive";
    const vpParams = MINIMAL_VIEWPORTS[vpName];

    if (vpParams) {
      const width = parseInt(vpParams.styles.width);
      const height = parseInt(vpParams.styles.height);
      page.setViewportSize({ width, height });
    } else {
      page.setViewportSize(DEFAULT_VP_SIZE);
    }
  },
};
