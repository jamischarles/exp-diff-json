/*
 * Diff logic for JSON
 *
 */

import { sortJSONKeys, prettyPrint } from "../json-utils.js";

// Q: Can this be a transform pipeline?
// TODO: could really start being TS now?
// NO. later.
// generates a report based on the diff
export function diffJSON(valA, valB, diffOptions) {
  let isMatch;

  console.log("diffOptions", diffOptions);

  let a = {
    isSyntaxValid: true,
    originalVal: valA,
    val: valA, // value to render
  };

  let b = {
    isSyntaxValid: true,
    originalVal: valB,
    val: valB, // value to render
  };

  // check for valid JSON
  try {
    JSON.parse(a.val);
  } catch (e) {
    a.isSyntaxValid = false;
  }

  try {
    JSON.parse(b.val);
    // TODO: fix this normalizing step
  } catch (e) {
    b.isSyntaxValid = false;
  }

  formatCodeSnippet(a, b, diffOptions);

  // diff what's in the UI
  if (a.val === b.val) {
    isMatch = true;
    console.log("match");
  } else {
    isMatch = false;
    console.log("no match");
  }

  // TODO: Return report
  return {
    isMatch,
    a,
    b,
  };
}

// Apply the various transforms and formats from the user input
// FIXME: Do a clone instead of mutation?
// Would be nice to keep a record of the transactions
// starts with the userInput (un-formatted). then applies various formatting / sanitizing based on the options passed in
function formatCodeSnippet(a, b, diffOptions) {
  // sort keys if both have valid syntax
  if (a.isSyntaxValid && b.isSyntaxValid && diffOptions.shouldSortKeys) {
    a.val = sortJSONKeys(a.val);
    b.val = sortJSONKeys(b.val);
  }

  // update the state in the UI
  // TODO: should this be a a servializer step? TODO: fix remobiing const obj
  if (diffOptions.shouldPrettyPrint) {
    a.val = prettyPrint(a.val);
    b.val = prettyPrint(b.val);
  }
}

// setStatusBar("b", "Valid JSON");
// setStatusBar("b", "INVALID JSON");
