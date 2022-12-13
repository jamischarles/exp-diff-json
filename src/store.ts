/**
 * Store
 * Reading: https://dev.to/jdgamble555/the-unwritten-svelte-stores-guide-47la
 */

import { writable, derived, get } from 'svelte/store';

// OPTIONS ---------------------------
export const optShouldSortKeys = writable(false);
export const optShouldPrettyPrint = writable(false);
const options = [optShouldSortKeys, optShouldPrettyPrint];

export function getCurrentDiffOptions() {
	return {
		shouldSortKeys: get(optShouldSortKeys), // reads the value
		shouldPrettyPrint: get(optShouldPrettyPrint)
	}
}


// DIFF FIELDS ----------------------------------------

// TODO: turn this into an object. Derived? a.userInput  a.output

// what user entered
export const field_A_user_input = writable("");
export const field_B_user_input = writable("");

// what we show after some formatting / massaging
export const field_A_to_render = writable("");
export const field_B_to_render = writable("");

export const is_A_syntax_valid = writable(false);
export const is_B_syntax_valid = writable(false);
export const diffIsMatch = writable(false);

// should we re-run the diff because some values / options have changed?
// export const isDiffDirty = writable(false);

// weirdness because you can't manually set a derived store. So we have to do this weirdness
export const isDiffDirty = writable(false);

// runs the callback if any of the values change
//https://stackoverflow.com/questions/69851016/how-to-subscribe-to-two-or-more-svelte-stores
// DO NOT listen for to_render because that would result in infinite re-render  loop
const shouldMarkDiffAsDirty = derived([...options, field_A_user_input, field_B_user_input], ()=>{ 
	isDiffDirty.set(true); // fires if any of these stores are changed
});

// hacky because the store will ONLY run if somebody subscribes to it. 
shouldMarkDiffAsDirty.subscribe(()=>{})


// FIELD-A
// FIELD-B
// FieldAStatus
// FieldBStatus
// // FIXME: Q: SHould this just be an object that isn't coupled to the UI? YES
//
//
//
