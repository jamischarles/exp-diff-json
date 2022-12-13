<script lang='ts'>
  import {diffJSON} from './lib/diff-engines/json.js'	
  import {field_A_user_input, field_B_user_input, is_A_syntax_valid, is_B_syntax_valid, diffIsMatch, isDiffDirty, getCurrentDiffOptions, field_A_to_render, field_B_to_render, optShouldSortKeys, optShouldPrettyPrint} from './store.ts';

  // FIXME:refactor according to a.* and b.* and shared/common/misc whatever...
  // use a derived store?

  /* TODO: next
  1. Run the diff on load
  2. Subscribe to all the option changes and run diff when that happens. (controlled from UI here)
  */


  // OPTIONS: TODO: Should / can we make this an object?
  // TODO: Figure out the best way to manage state properly in Svelte
  // OPTIONS: TODO: orgnaize these better? Maybe in an object?
  // let shouldSortKeys = $optShouldSortKeys;
  // let shouldPrettyPrint = $optShouldPrettyPrint;


  // let valA = `{"a": "testA", "b": "testB"}`;
  // let valB = `{b: 'testB', a: 'testA'}`;



  $field_A_user_input = `{"a": "testA", "b": "testB"}`;
  $field_B_user_input = `{"b": "testB", "a": "testA"}`;

  // will run the first time it subscribes
  isDiffDirty.subscribe(e=> {
	  console.log('Diff dirty UPDATE', e);
	  // if diff is dirty, run the update
	  if ($isDiffDirty) {
		  const diffOptions = getCurrentDiffOptions();
		  const diffResult = diffJSON($field_A_user_input, $field_B_user_input, diffOptions);
		  isDiffDirty.set(false);

		  // FIXME: is this the right place for all this?
		  if (diffResult.isMatch) {
			  diffIsMatch.set(true);
		  } else {
			  diffIsMatch.set(false);
		  }

		  // update the store so the fields in the UI will reflect these values
		  $field_A_to_render = diffResult.a.val;
		  $field_B_to_render = diffResult.b.val;

		  // is syntax valid?
		  // TODO: can we have some sort of "processResult()" function that has a bunch of actions based on that somewhere?

		  // bool
		  $is_A_syntax_valid = diffResult.a.isSyntaxValid;
		  $is_B_syntax_valid = diffResult.b.isSyntaxValid;
	  }
  })





  // Data flow.
  // update the store. Updates the UI. Just like redux

  // TODO: run this on valA and on valB
  // TODO: Where should this be? This should be in diff-engines in lib prolly


  // subscriptions should be here. Calling runDiff should be here. THIS is the orchestrator. This initiates state updates etc


  // on options change just update the store? Is how that works?


  // TODO: build the status bar from state like we do with vim 


// function updateOnUserInput

</script>



<main>
 

  <h2 data-testid="diff-status-indicator" class="diff-status-{$diffIsMatch ? 'same' : 'not-same'}">Diff</h2>

  <div id="options">
	  <h3>Options</h3>
	  <input type="checkbox" bind:checked={$optShouldSortKeys} id="sort-keys" data-testid="options-ignore-key-order" />
      <label for="sort-keys">Ignore Key order (sort)</label>

	  <input type="checkbox" bind:checked={$optShouldPrettyPrint}  id="pretty-print" data-testid="options-format-pretty-print" />
      <label for="pretty-print">Pretty-print/format</label>


  </div>

  <textarea 
			 on:input={(e)=> $field_A_user_input = e.target.value}
	 data-testid="diff-field-a"
	 value={$field_A_to_render} />
  <div data-testid="status-bar-a">{$is_A_syntax_valid ? "Valid JSON": "INVALID JSON"}</div>

  <textarea 
			 on:input={(e)=> $field_B_user_input = e.target.value}
	  data-testid="diff-field-b"
  value={$field_B_to_render} />
  <div data-testid="status-bar-b">{$is_B_syntax_valid ? "Valid JSON": "INVALID JSON"}</div>

  
</main>

<style>
  .diff-status-same {
    background-color: #2da44e;
  }
  .diff-status-not-same {
    background-color: #fa4549;
  }

  textarea {
    height: 500px;
    width: 400px;
  }
  
  .read-the-docs {
    color: #888;
  }
</style>
