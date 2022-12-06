// Page object model of the main page so we can reuse locators and page for common actions
// https://playwright.dev/docs/pom

import { expect } from "@playwright/test";

// test hooks are good for resuable pieces that don't export anything (like navigation & setup / teardown)
// fixtures are great for things that need to return stuff (page, baseUrl are fixtures )
//
// use https://playwright.dev/docs/pom for resuable parts we want to expose
// use fixtures for when you want to call parts of the POM (like "AddTodoItem") etc...
//https://playwright.dev/docs/pom

// page object model
export class MainPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    this.firstDiffInput = page.getByTestId("diff-field-a");
    this.secondDiffInput = page.getByTestId("diff-field-b");

    this.firstDiffStatusBar = page.getByTestId("status-bar-a");
    this.secondDiffStatusBar = page.getByTestId("status-bar-b");

    this.diffStatusIndicator = page.getByTestId("diff-status-indicator");

    // this.options = page.page.getByTestId("diff-options");
  }

  async goto() {
    await this.page.goto("/");
    await expect(this.page).toHaveTitle(/Differ/);
  }

  //  async getStarted() {
  //    await this.getStartedLink.first().click();
  //    await expect(this.gettingStartedHeader).toBeVisible();
  //  }
  //
  // // Q: What does this do?
  //  async pageObjectModel() {
  //    await this.getStarted();
  //    await this.pomLink.click();
  //  }
}

