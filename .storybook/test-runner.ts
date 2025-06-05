import { StoryFn } from "@storybook/react-webpack5";
import { Page } from "playwright";

const { getStoryContext } = require("@storybook/test-runner");
const { MINIMAL_VIEWPORTS } = require("storybook/viewport");

const DEFAULT_VP_SIZE = { width: 1280, height: 720 };

/**
 * Attempt to solve: https://github.com/storybookjs/test-runner/issues/442.
 * GitHub's suggestions did not work at time of writing.
 * @param page
 * @param story
 * @param attempt
 * @param maxAttempts
 */
async function waitForStoryContext(
  page: Page,
  story: StoryFn,
  attempt = 1,
  maxAttempts = 20,
) {
  try {
    return await getStoryContext(page, story);
  } catch (e) {
    if (attempt > maxAttempts) {
      throw e;
    }
    // ¯\_(ツ)_/¯ - If this is not the first attempt: add a timeout.
    await new Promise(resolve => setTimeout(resolve, 600));
    return waitForStoryContext(page, story, attempt + 1);
  }
}

module.exports = {
  /**
   * This makes sure the test runner respects the viewport.
   * @see {@link https://github.com/storybookjs/test-runner/issues/85#issuecomment-1576465128|[Bug] Tests always run in the default viewport}
   * @param page
   * @param story
   */
  async preVisit(page: Page, story: StoryFn) {
    const context = await waitForStoryContext(page, story);
    const vpName =
      context.parameters?.viewport?.defaultViewport ?? "responsive";
    const vpParams = MINIMAL_VIEWPORTS[vpName];

    if (vpParams) {
      const width = parseInt(vpParams.styles.width);
      const height = parseInt(vpParams.styles.height);
      return await page.setViewportSize({ width, height });
    } else {
      return await page.setViewportSize(DEFAULT_VP_SIZE);
    }
  },
};
