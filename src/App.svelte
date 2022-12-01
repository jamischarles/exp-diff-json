<script>
  import svelteLogo from './assets/svelte.svg'
  import Counter from './lib/Counter.svelte'

/* Modules */
  // import * as acorn from 'acorn-loose' // error tolerant (will guess)
  import * as acorn from 'acorn' // error tolerant (will guess)
  import * as walk from 'acorn-walk'

  // import * as parse from 'json-to-ast' // abandoned for now because no easy way to generate valid JSON from that ast. Let's try acorn again...
  import { generate } from 'astring' // Q: Can we convert ^ JSON-ast to JS with astring?
  // TODO: move this out into it's own VANILLA module (LATER)

  // TOOD: 
  /*
  0. Color whole thing green if same - DONE
  1. Ignore styling differences (Prettier?)
  2. Ignore sorting differences (AST?) Or prettier plugin? Or do it from scratch first? Hacky first. Doesn't need to be very stable at first.
  */

  let diffStatus;

  let valA = `{"a": "testA", "b": "testB"}`;
  let valB = `{"b": "testB", "a": "testA"}`;

  // let valA = `{"a": "testA", "b": "testB"}`;
  // let valB = `{b: 'testB', a: 'testA'}`;

  const blockA = document.querySelector('#block-a');
  const blockB = document.querySelector('#block-b');

  

  // TODO: Move this to an external file
  // first level sorting only...
  function sortJSONKeys(inputString) {
    let ast = acorn.parse("const obj = " + inputString, {});
    console.log('result', ast);


    walk.simple(ast, {
      Literal(node) {
        console.log(`Found a literal: ${node.value}`)
      },
      VariableDeclaration(node) {
        console.log("Found a VariableDeclaration:", node)
      },
      ObjectExpression(node) {
        
        console.log("Found a ObjectExpression:", node)
        // SORT
        node.properties.sort((nodeA,nodeB)=>{
          // debugger;
          const keyA = nodeA?.key?.value;
          const keyB = nodeB?.key?.value;

          // Q: How should I sort if one is a string and one isn't? or do all keys HAVE to be keys?
          // MUST be a) string or b) Symbol
          if (typeof keyA === "string" && typeof keyB === "string") {
            let result = keyA.localeCompare(keyB);

            if (result > 0) return 1;
            if (result < 0) return -1;
            return 0;
          }

          // just leave order as is if not a string
          return 0;

        })
        console.log("Found a ObjectExpression: SORTED", node)


        
      }
  })

  


    let sortedJsonString = generate(ast)
    console.log('##GENERATED OUTPUT:!!', sortedJsonString);

    return sortedJsonString;
  }

  // TODO: run this on valA and on valB
  function runDiff() {
    // TODO: fix this normalizing step
    const sortedAString = sortJSONKeys(valA);
    const sortedBString = sortJSONKeys(valB);


    if (sortedAString === sortedBString) {
      diffStatus = "same";
    console.log('match');
    } else {
      diffStatus = "not-same";
      console.log('no match');
    }
  }

  runDiff();

</script>



<main>
 

  <h2 class="diff-status-{diffStatus}">Diff</h2>
  <textarea 
  on:input={(e) => {valA = e.target.value; runDiff()}}
  bind:value={valA} />

  <textarea 
  on:input={(e) => {valB = e.target.value; runDiff()}}
  bind:value={valB} />

  
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
