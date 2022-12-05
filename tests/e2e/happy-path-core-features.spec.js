// @ts-check
import { test, expect } from "@playwright/test";
import * as base from "@playwright/test";
import { MainPage } from "./main-page.js";

// FIXME:  architecture (later?)
//
/*
 * By default we try to extract as much context as possible, then fallback to less specific diffs. 
 * When JSON parse fails, (for now) do a string diff
 *
 *
* Different diff engines by language / context. 

Use vitest in source unit tests for that logic. 

Diff engine returns a report to object. 

We can verify e2e that the report obj gets translated to UI properly for the various types. 

But bulk of test will likely be verifying that the report is accurate 
*/

// FIXME: Find a better way to organize these blocks by feature ? 
test.describe("UI on the page...", () => {
  // test hook. Doesn't need the describe block to work
  test.beforeEach(async ({ page }) => {
    const mainPage = new MainPage(page);
    await mainPage.goto();
  });

  // FIXME: Split 2nd and first half out
  test("shows 2 input fields. If JSON string in fields MATCHES indicator shows GREEN", async ({
    page,
  }) => {
    const mainPage = new MainPage(page);
    await mainPage.goto();

    const valA = `{"a": "testA", "b": "testB"}`;
    const valB = `{"a": "testA", "b": "testB"}`;

    // fill with valid input
    await mainPage.firstDiffInput.fill(valA);
    await mainPage.secondDiffInput.fill(valB);

    await expect(mainPage.diffStatusIndicator).toHaveClass(/diff-status-same/);
  });

  test("shows 2 input fields. If JSON string in fields DOES NOT MATCH indicator shows RED", async ({
    page,
  }) => {
    const mainPage = new MainPage(page);
    await mainPage.goto();

    const valA = `{"a": "testA"}`;
    const valB = `{"b": "testB"}`;

    // fill with valid input
    await mainPage.firstDiffInput.fill(valA);
    await mainPage.secondDiffInput.fill(valB);

    await expect(mainPage.diffStatusIndicator).toHaveClass(
      /diff-status-not-same/
    );
  });
});


// FIXME: Find better feature grouping / naming here...
test.describe("JSON test features...", () => {
  test("ignore JSON KEY order: 2 input fields indicate MATCH if JSON keys are in wrong order, but are otherwise identical", async ({
    page,
    baseURL,
  }) => {
    // FIXME: Can I somehow expose this from before hook? Maybe that's where the fixture comes in
    const mainPage = new MainPage(page);
    await mainPage.goto();
    const { firstDiffInput, secondDiffInput, diffStatusIndicator } = mainPage;

    const valA = `{"a": "testA", "b": "testB"}`;
    const valB = `{"b": "testB", "a": "testA"}`;

    // fill with valid input
    await firstDiffInput.fill(valA);
    await secondDiffInput.fill(valB);

    await expect(diffStatusIndicator).toHaveClass(/diff-status-same/);
  });

  // JSON valid / linting features
  test("If json is malformed (parse error) in either window, indicate with red/green if it's valid / invalid syntax", async ({
    page,
    baseURL,
  }) => {
    const mainPage = new MainPage(page);
    await mainPage.goto();
    const { firstDiffInput, secondDiffInput, firstDiffStatusBar, secondDiffStatusBar, diffStatusIndicator } = mainPage;

    const valAInvalid = `a": "testA", "b": "testB"}`;
    const valBInvalid = `{"b": testB", "a" "testA"`;

    const valAValid = `{"a": "testA", "b": "testB"}`;
    const valBValid = `{"b": "testB", "a": "testA"}`;

    // fill both with IN-VALID input
    await firstDiffInput.fill(valAInvalid);
    await secondDiffInput.fill(valBInvalid);

    await expect(firstDiffStatusBar).toHaveText("INVALID JSON");
    await expect(secondDiffStatusBar).toHaveText("INVALID JSON");

    // fill both with VALID input
    await firstDiffInput.fill(valAValid);
    await secondDiffInput.fill(valBValid);

    await expect(firstDiffStatusBar).toHaveText("Valid JSON");
    await expect(secondDiffStatusBar).toHaveText("Valid JSON");

    // one Valid, one invalid
    await firstDiffInput.fill(valAValid);
    await secondDiffInput.fill(valBInvalid);

    await expect(firstDiffStatusBar).toHaveText("Valid JSON");
    await expect(secondDiffStatusBar).toHaveText("INVALID JSON");
  });

	test("If json is invalid, differ should still do a normal string diff" , async ({
    page,
  }) => {
    const mainPage = new MainPage(page);
    await mainPage.goto();
    const { firstDiffInput, secondDiffInput, diffStatusIndicator } = mainPage;

    const valAMatch = `a": "testA", "b" "testB"`;
    const valBMatch = `a": "testA", "b" "testB"`;

    const valAMismatch = `, "b" "testB"`;
    const valBMismatch = `a": "testA", "b" "testB"`;

    // fill with same (but INVALID syntax)
    await firstDiffInput.fill(valAMatch);
    await secondDiffInput.fill(valBMatch);

    await expect(diffStatusIndicator).toHaveClass(/diff-status-same/);

    // fill with same (but VALID syntax)
    await firstDiffInput.fill(valAMismatch);
    await secondDiffInput.fill(valBMismatch);

    await expect(diffStatusIndicator).toHaveClass(/diff-status-not-same/);
  });
});

// if either side (or both) has invalid JSON UI should correctly show if both sides match or not
//
// UI should show which features CAN be applied with the given input (sort strings should be disabled if invalid json)
// UI should show what parsing engine was used for the diffing
// UI should show what changes & transforms were applied 
