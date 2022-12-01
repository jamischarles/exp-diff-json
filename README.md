# exp-diff-json / Diff This - JSON objects

[Edit on StackBlitz ⚡️](https://stackblitz.com/edit/vitejs-vite-rkyhn5)


## TODO
[x] Set up playwright so we can add these features in there
[x] Write a few good tests around the first use case


## Feature statements
[x] Will diff 2 JSON objects
[x] Will normalize key order between objects
  SELF: Consider using just normal JSON and then hacking around the fact that it's an object expression (convert it to that so acorn / astring will work properly)


### Core Features
Answers the following questions
[x] Are the keys the same, but in different order?
[ ] Will indicate if JSON is valid syntax. the JSON syntax valid? (JSON.parse()) - will indicate to user if jSON is invalid 
  [ ] Will show "mismatch / error" symbol if syntax is invalid 
    [ ] ability to toggle this as an option  
[ ] Ability to toggle to ignore key order		

[ ] Are the keys different? Modified vs missing vs added
[ ] Are the values on the keys different? (value vs type)
[ ] 
[ ] Will show JSON in a pleasing way (codemirror?) (code folding etc)
  TODO: DEFINE

## Internal assertions (non-behavior driven)
[ ] Will convert valid JSON to correct AST representation and generate correct JSON that is ~ same as input JSON.

LATER
[ ] Set up GH actions pipeline to run the assertions with playwright, THEN deploy to vercel after they all pass. YAS



LATER
[ ] Will handle basic JSON parsing errors (like quotes missing from keys, or wrong type of quotes). TODO: add unit tests around this...


[ ] Will normalize spacing differences (syntactically correct) (prettier style)
  TODO: Define this more granularly (by tests cases)

Display / output
[ ] Will display the objects in a very helpful & pleasing way (TODO: DEFINE THIS IN MORE DETTAIL that can be asserted against.)

Linting / Validation / repair of the JSON?
[ ] Will indicate whether INPUT is valid in either window
[ ] Will offer suggestions / auto-fixing (where possible) for fixing the invalid JSON syntax
[ ] Normalize quote types etc for valid JSON?
[ ] ?BIG? Will repair missing quotes etc. and show what has been repaired?


## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Svelte](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode).

## Need an official Svelte framework?

Check out [SvelteKit](https://github.com/sveltejs/kit#readme), which is also powered by Vite. Deploy anywhere with its serverless-first approach and adapt to various platforms, with out of the box support for TypeScript, SCSS, and Less, and easily-added support for mdsvex, GraphQL, PostCSS, Tailwind CSS, and more.

## Technical considerations

**Why use this over SvelteKit?**

- It brings its own routing solution which might not be preferable for some users.
- It is first and foremost a framework that just happens to use Vite under the hood, not a Vite app.

This template contains as little as possible to get started with Vite + Svelte, while taking into account the developer experience with regards to HMR and intellisense. It demonstrates capabilities on par with the other `create-vite` templates and is a good starting point for beginners dipping their toes into a Vite + Svelte project.

Should you later need the extended capabilities and extensibility provided by SvelteKit, the template has been structured similarly to SvelteKit so that it is easy to migrate.

**Why `global.d.ts` instead of `compilerOptions.types` inside `jsconfig.json` or `tsconfig.json`?**

Setting `compilerOptions.types` shuts out all other types not explicitly listed in the configuration. Using triple-slash references keeps the default TypeScript setting of accepting type information from the entire workspace, while also adding `svelte` and `vite/client` type information.

**Why include `.vscode/extensions.json`?**

Other templates indirectly recommend extensions via the README, but this file allows VS Code to prompt the user to install the recommended extension upon opening the project.

**Why enable `checkJs` in the JS template?**

It is likely that most cases of changing variable types in runtime are likely to be accidental, rather than deliberate. This provides advanced typechecking out of the box. Should you like to take advantage of the dynamically-typed nature of JavaScript, it is trivial to change the configuration.

**Why is HMR not preserving my local component state?**

HMR state preservation comes with a number of gotchas! It has been disabled by default in both `svelte-hmr` and `@sveltejs/vite-plugin-svelte` due to its often surprising behavior. You can read the details [here](https://github.com/rixo/svelte-hmr#svelte-hmr).

If you have state that's important to retain within a component, consider creating an external store which would not be replaced by HMR.

```js
// store.js
// An extremely simple external store
import { writable } from 'svelte/store'
export default writable(0)
```

