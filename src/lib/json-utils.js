/*
 * Utils to help with diffing JSON specifically
 */

  // import * as acorn from 'acorn-loose' // error tolerant (will guess)
  import * as acorn from 'acorn' // error tolerant (will guess)
  import * as walk from 'acorn-walk'

  // import * as parse from 'json-to-ast' // abandoned for now because no easy way to generate valid JSON from that ast. Let's try acorn again...
  import { generate } from 'astring' // Q: Can we convert ^ JSON-ast to JS with astring?
  // TODO: move this out into it's own VANILLA module (LATER)


  // format the JSON code
  export function prettyPrint(code) {
	  // TODO: Use prettier? Or another lib?
  // strip all the line breaks, then add them back in...
	return code.replaceAll("\n","").replace(/(,|{)/g, "$1\n").replace("}", "\n}");
  }


// first level sorting only...
export function sortJSONKeys(inputString) {
  let ast = acorn.parse("const obj = " + inputString, {});
  console.log("result", ast);

  walk.simple(ast, {
    Literal(node) {
      console.log(`Found a literal: ${node.value}`);
    },
    VariableDeclaration(node) {
      console.log("Found a VariableDeclaration:", node);
    },
    ObjectExpression(node) {
      console.log("Found a ObjectExpression:", node);
      // SORT
      node.properties.sort((nodeA, nodeB) => {
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
      });
      console.log("Found a ObjectExpression: SORTED", node);
    },
  });

  let sortedJsonString = generate(ast);
  console.log("##GENERATED OUTPUT:!!", sortedJsonString);

  return sortedJsonString;
}
