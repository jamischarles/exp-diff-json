// @ts-check
import { test, expect } from "@playwright/test";

// SHARED logic
// FIXME: Is there a more "playwright" way to do this?
function navigateToFirstPageAndGetLocators() {}

// FIXME: How can I group these better by feature? Different files?

// main UI
test("shows 2 input fields. If JSON string in fields MATCHES indicator shows GREEN", async ({
  page,
  baseURL,
}) => {
  await page.goto(baseURL + "/");

  // am I on the right page?
  await expect(page).toHaveTitle(/Differ/);

  const valA = `{"a": "testA", "b": "testB"}`;
  const valB = `{"a": "testA", "b": "testB"}`;

  // locators
  const firstDiffInput = page.getByTestId("diff-field-a");
  const secondDiffInput = page.getByTestId("diff-field-b");
  const diffStatusIndicator = page.getByTestId("diff-status-indicator");

  // fill with valid input
  await firstDiffInput.fill(valA);
  await secondDiffInput.fill(valB);

  await expect(diffStatusIndicator).toHaveClass(/diff-status-same/);
});

test("shows 2 input fields. If JSON string in fields DOES NOT MATCH indicator shows RED", async ({
  page,
  baseURL,
}) => {
  await page.goto(baseURL + "/");

  // am I on the right page?
  await expect(page).toHaveTitle(/Differ/);

  const valA = `{"a": "testA"}`;
  const valB = `{"b": "testB"}`;

  // locators
  const firstDiffInput = page.getByTestId("diff-field-a");
  const secondDiffInput = page.getByTestId("diff-field-b");
  const diffStatusIndicator = page.getByTestId("diff-status-indicator");

  // fill with valid input
  await firstDiffInput.fill(valA);
  await secondDiffInput.fill(valB);

  await expect(diffStatusIndicator).toHaveClass(/diff-status-not-same/);
});

// JSON DIFF FEATURES
test("ignore JSON KEY order: 2 input fields indicate MATCH if JSON keys are in wrong order, but are otherwise identical", async ({
  page,
  baseURL,
}) => {
  await page.goto(baseURL + "/");

  // am I on the right page?
  await expect(page).toHaveTitle(/Differ/);

  const valA = `{"a": "testA", "b": "testB"}`;
  const valB = `{"b": "testB", "a": "testA"}`;

  // locators
  const firstDiffInput = page.getByTestId("diff-field-a");
  const secondDiffInput = page.getByTestId("diff-field-b");
  const diffStatusIndicator = page.getByTestId("diff-status-indicator");

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
  await page.goto(baseURL + "/");

  // am I on the right page?
  await expect(page).toHaveTitle(/Differ/);

  const valAInvalid = `a": "testA", "b": "testB"}`;
  const valBInvalid = `{"b": testB", "a" "testA"`;

  const valAValid = `{"a": "testA", "b": "testB"}`;
  const valBValid = `{"b": "testB", "a": "testA"}`;

  // locators
  const firstDiffInput = page.getByTestId("diff-field-a");
  const secondDiffInput = page.getByTestId("diff-field-b");
  const diffStatusIndicator = page.getByTestId("diff-status-indicator");

  const diffWindowAStatusBar = page.getByTestId("status-bar-a");
  const diffWindowBStatusBar = page.getByTestId("status-bar-b");

  // fill both with IN-VALID input
  await firstDiffInput.fill(valAInvalid);
  await secondDiffInput.fill(valBInvalid);

  await expect(diffWindowBStatusBar).toHaveText("INVALID JSON");
  await expect(diffWindowBStatusBar).toHaveText("INVALID JSON");

  // fill both with VALID input
  await firstDiffInput.fill(valAValid);
  await secondDiffInput.fill(valBValid);

  await expect(diffWindowAStatusBar).toHaveText("Valid JSON");
  await expect(diffWindowBStatusBar).toHaveText("Valid JSON");

  // one Valid, one invalid
  await firstDiffInput.fill(valAValid);
  await secondDiffInput.fill(valBInvalid);

  await expect(diffWindowAStatusBar).toHaveText("Valid JSON");
  await expect(diffWindowBStatusBar).toHaveText("INVALID JSON");
});

// if either side (or both) has invalid JSON UI should correctly show if both sides match or not
