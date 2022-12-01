// @ts-check
import { test, expect } from "@playwright/test";

// main UI
test("will diff 2 JSON strings with green for match", async ({
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

test("will diff 2 JSON strings with red for MISMATCH", async ({
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
