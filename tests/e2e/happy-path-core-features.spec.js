// @ts-check
import { test, expect } from "@playwright/test";


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
