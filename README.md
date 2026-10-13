# Peranti Extensions

Extensions you can install from **Extensions → Discover** in [Peranti](https://github.com/nacasha/Peranti).
Peranti downloads only the folder of the extension you install.

## Adding an extension

1. Create `extensions/<id>/`, where `<id>` uses lowercase letters, digits and dashes.
2. Add a `peranti.json`, and a `tools/<tool>/peranti.tool.json` for each tool it provides.
3. Link this repo's folder in **Settings → Extensions → Choose Folder** to try it,
   then open a pull request. There is nothing to build: Peranti reads the folders as they are.

Bump `version` whenever you change an extension, so installed copies show an update.

## Layout

An extension is a folder with one `peranti.json`, which describes the extension.
Each tool is a folder in `tools/` with a `peranti.tool.json`, and each
component is a folder in `components/` with a `peranti.component.json`.
Peranti finds them on its own, so adding a tool means adding its folder.

```
extensions/text-kit/
├── peranti.json                      # the extension
├── tools/
│   ├── slugify/
│   │   ├── peranti.tool.json         # one tool, ID "slugify"
│   │   └── slugify.js
│   └── word-count/
│       ├── peranti.tool.json
│       └── word_count.py
└── components/
    └── hue-wheel/
        ├── peranti.component.json    # one component, ID "hue-wheel"
        └── index.html
```

**Folder names are the IDs.** None of the files has an ID field: the
extension's ID is its folder name, and a tool's or component's ID is its
folder name in kebab case (`Word Count` and `word_count` both become
`word-count`). Two folders that give the same ID are an error. Renaming a
folder renames the ID, so it closes the tool's open tabs.

Every `sample-*` extension follows this layout.

## Runtimes

Every tool picks its own runtime, so one extension can mix them. Each takes
the input values as one JSON object and returns the output values as one JSON
object. Paths in a tool are relative to its own `peranti.tool.json`.

**`javascript`** runs in a Web Worker, on desktop and in the browser. It has browser APIs only: no `fs`, `require` or `process`.

```json
{ "runtime": "javascript", "javascript": { "entry": "action.js" } }
```
```js
export default function action({ text }) {
  return { result: text.toUpperCase() }
}
```

**`executable`** runs any program in the desktop app, from inside the folder of the tool's `peranti.tool.json`.
The input values are written to stdin and the output values are read from stdout.
A non-zero exit shows stderr as the error. `timeoutMs` defaults to 30000.

```json
{ "runtime": "executable", "executable": { "command": "python3", "args": ["main.py"] } }
```

Peranti asks for confirmation before installing an extension with an executable tool, and shows which commands it runs.

## `peranti.json`

```json
{
  "name": "Text Kit",
  "version": "1.0.0",
  "category": "Text"
}
```

| Field | Required | |
|---|---|---|
| `name` | yes | |
| `version` | yes | Dotted numbers, like `1.2.0` |
| `description`, `author` | no | Shown in the catalog |
| `category` | no | Default for tools without one |

## `peranti.tool.json`

```json
{
  "name": "Slugify",
  "runtime": "javascript",
  "javascript": { "entry": "slugify.js" },
  "inputFields": [{ "key": "text", "label": "Text", "component": "TextArea" }],
  "outputFields": [{ "key": "slug", "label": "Slug", "component": "Text" }]
}
```

| Field | Required | |
|---|---|---|
| `name` | yes | |
| `runtime` | yes | `javascript` or `executable`, with its `javascript` or `executable` settings |
| `inputFields`, `outputFields` | yes | Same fields as Peranti's built-in tools |
| `description`, `category` | no | `category` falls back to the extension's |
| `autoRun`, `samples`, `layoutSetting` | no | |

The extension installs, updates and is enabled as one. Each tool shows up in
Peranti on its own, with the ID `<extension id>/<tool folder>`.

## Components

When no built-in field fits, an extension can draw its own with HTML. Its tools
use it with `"component": "@<component folder>"`, such as `"@hue-wheel"`. A component belongs to its
extension: other extensions can't use it. See
[`sample-color-kit`](extensions/sample-color-kit) for an input (a hue wheel)
and an output (a palette strip).

```json
{
  "name": "Hue Wheel",
  "kind": "input",
  "entry": "index.html",
  "height": 220
}
```

| Field | Required | |
|---|---|---|
| `name` | yes | |
| `entry` | yes | HTML file inside the component's folder, such as `index.html` or `dist/index.html` |
| `kind` | no | `input`, `output` or `both` (default) |
| `height` | no | Starting height in pixels, default 160. The frame then follows the content height |
| `value` | no | What its value is, see below. Treated as any JSON when left out |
| `description` | no | |

`value` describes the value for people using the component, and Peranti shows
it on the Components screen:

```json
"value": {
  "type": "object",
  "description": "The picked color: { hue: 0-359, lightness: 15-85 }",
  "example": { "hue": 200, "lightness": 55 }
}
```

`type` is one of `string`, `number`, `boolean`, `json-string` (JSON written as
text), `object`, `array`, `any` or `none`. `example` is the starting value on
the Components screen when no tool sets a default.

For an `object` or an `array`, `fields` describes its structure: the keys of
the object, or the keys of each item of the array. Each key takes the same
`name`, `type`, `description`, `required` and `options` as a prop, and the
Components screen checks values against them. An array of plain values sets
`itemType` instead, such as `"itemType": "string"`.

```json
"value": {
  "type": "array",
  "description": "Colors to show",
  "fields": [
    { "name": "name", "type": "string", "required": true },
    { "name": "hex", "type": "string", "required": true, "description": "Any CSS color" }
  ]
}
```

`props` lists what the component reads from `peranti.props`, which is the
`"props"` a tool sets on the field. The Components screen lists them, adds
them with one click, and checks what is typed against them:

```json
"props": [
  { "name": "showHex", "type": "boolean", "default": true, "description": "Show the hex code under each color" },
  { "name": "size", "type": "string", "default": "medium", "options": ["small", "medium", "large"] }
]
```

| Field | Required | |
|---|---|---|
| `name` | yes | |
| `type` | yes | Same types as `value` |
| `description` | no | |
| `default` | no | What the component uses when the prop is left out |
| `options` | no | The values allowed, for a prop that picks one of a few |
| `required` | no | `true` when the component shows nothing useful without it |
| `example` | no | Filled in when the prop is added on the Components screen |

The HTML runs in a sandboxed frame. It can't reach Peranti, its storage, your
files or the network, and can't load anything from outside. Scripts and
stylesheets it links next to it (`<script src="wheel.js">`,
`<link rel="stylesheet" href="style.css">`) are inlined when it loads, and
images must be `data:` URLs.

It talks to Peranti through `window.peranti`:

```js
peranti.onValue((value) => { /* draw it */ })  // now, and on every change from Peranti
peranti.setValue({ hue: 120 })                  // inputs only
peranti.mode       // "input" or "output"
peranti.readOnly   // true for outputs and closed tabs
peranti.props      // the field's "props" from peranti.tool.json
```

Values are plain JSON, and are what the tool receives and returns. Peranti's
theme comes in as CSS variables (`var(--accent)`, `var(--text-color)`,
`var(--line)`, `var(--font-family)`, …) and follows dark mode and the accent
colour.

### UI frameworks

Any framework works, as long as everything it needs ends up in files next to
the component. Links are read relative to the HTML file, so `entry` can be a
build output such as `dist/index.html`.

| Sample | Framework | Build | Component |
|---|---|---|---|
| [`sample-react-kit`](extensions/sample-react-kit) | React | Vite | JSON tree (output) |
| [`sample-svelte-kit`](extensions/sample-svelte-kit) | Svelte | Vite | Star rating (input) |
| [`sample-vue-kit`](extensions/sample-vue-kit) | Vue | none | Tag input (input) |
| [`sample-alpine-kit`](extensions/sample-alpine-kit) | Alpine.js | none | Checklist (input) |

**With a build**, keep the output to one JS file and one CSS file. The frame
can't load a second chunk or an asset file, so in Vite:

```js
export default defineConfig({
  base: "./",
  build: {
    assetsInlineLimit: Number.MAX_SAFE_INTEGER, // images and fonts as data: URLs
    cssCodeSplit: false,
    modulePreload: false,
    rollupOptions: { output: { inlineDynamicImports: true } }
  }
})
```

Run the build and commit `dist/`: Peranti installs the files as they are and
never runs `npm`. `node_modules` is never listed or installed.

**Without a build**, put the framework's single-file browser build in the
component folder and link it with `<script src>`. ES module `import`s between
files don't work, use the build that defines a global instead.

The frame doesn't allow `eval`, so frameworks that compile templates in the
browser need their no-eval variant: Vue's runtime build with render functions
(`h()`), and Alpine's CSP build (`@alpinejs/csp`), whose attributes name
properties and methods instead of holding expressions.

## Hosting your own catalog

A catalog is a folder of extension folders, each with a `peranti.json`. They
can sit in an `extensions` folder, as in this repo, or at the root. There is
no index file and no script to run.

In Peranti, open **Settings → Extensions** and add one:

| Source | Enter |
|---|---|
| GitHub, GitLab (including self-hosted), Gitea, Forgejo, Codeberg | The repo URL, plus a branch if it isn't `main` |
| A folder on your computer | Choose the folder. It's linked and runs from where it is |

A folder with a broken `peranti.json` is left out of the list, and the reason
is logged in the developer console.
