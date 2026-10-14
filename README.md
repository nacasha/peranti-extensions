# Peranti Extensions

Extensions you can install from **Extensions → Discover** in [Peranti](https://github.com/nacasha/Peranti).
Peranti downloads only the folder of the extension you install.

## Adding an extension

1. Create a folder `<id>/` at the root of this repo, where `<id>` uses lowercase letters, digits and dashes.
2. Add a `peranti.json`, and a `tools/<tool>/peranti.tool.json` for each tool it provides.
   An extension needs at least one tool.
3. Try it by adding this repo's folder in **Settings → Extensions** (switch to **Local**, then **Choose Folder**),
   then open a pull request. There is nothing to build: Peranti reads the folders as they are.

Bump `version` whenever you change an extension, so installed copies show an update.

## Layout

An extension is a folder with one `peranti.json`, which describes the extension.
Each tool is a folder in `tools/` with a `peranti.tool.json`, and each
component is a folder in `components/` with a `peranti.component.json`.
Peranti finds them on its own, so adding a tool means adding its folder.

```
text-kit/
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
A `javascript` tool is stopped after 30 seconds.

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
| `name` | no | Falls back to the folder name |
| `version` | no | Dotted numbers, like `1.2.0`. Left out it counts as `0.0.0`, so set it: it's how installed copies know an update exists |
| `description`, `author` | no | Shown in the catalog |
| `category` | no | Default for tools without one. Tools with neither show under "Extensions" |

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
| `name` | no | Falls back to the folder name |
| `runtime` | yes | `javascript` or `executable`, with its `javascript` or `executable` settings |
| `inputFields`, `outputFields` | yes | The tool's fields, see below |
| `description` | no | |
| `category`, `version`, `author` | no | Fall back to the extension's |
| `autoRun` | no | Runs the tool whenever an input changes. On when left out, set `false` for a tool that needs a Run button |
| `samples` | no | Examples to load: `[{ "name": "Hello", "inputValues": { "text": "Hello" } }]` |
| `layoutSetting` | no | How the input and output areas and their fields are placed, see below |
| `disableMultipleSession` | no | `true` keeps one open tab of the tool. Follows the user's multiple-tabs setting when left out |

Each field has a `key` (the name in the JSON the tool receives or returns), a
`label` and a `component`. Inputs may also set `defaultValue`, and any field
may set `props` for its component.

| Fields | Components |
|---|---|
| Inputs | `Text`, `TextArea`, `Switch`, `Checkbox`, `Select`, `DateTime`, `Code`, `File`, `Files`, `ListPick`, `ListReorder`, `ColorPicker` |
| Outputs | `Text`, `TextArea`, `Code`, `Markdown`, `KeyValue`, `GridStat`, `DataGrid`, `Diff`, `Image`, `File`, `IFrame`, `Mermaid`, `Pintora`, `Color`, `ColorPallete` |
| Either | `@<component folder>`, an extension's own component, see Components |

The `component` and `props` of each field work the same as in Peranti's own
tools. The samples here show the common ones: `Text` with `"props": { "type": "number" }`
and `Switch` with `options` in
[`sample-bash-calc`](sample-bash-calc/tools/bash-calc/peranti.tool.json).

### Screen layout

A tool's screen has two **areas**, input and output, and each holds its
**fields**. By default the areas sit side by side and the fields in each are
stacked top to bottom. `layoutSetting` changes that, and any setting left out
keeps its default.

| Setting | Values | Default | |
|---|---|---|---|
| `areaType` | `flex`, `grid` | `flex` | How the input and output **areas** are placed |
| `areaFlexDirection` | `horizontal`, `vertical` | `horizontal` | With `flex`: side by side, or input above output |
| `areaGridTemplate` | a CSS `grid-template` | | With `grid`: the areas are named `input` and `output` |
| `fieldsType` | `flex`, `grid` | `flex` | How the **fields** inside both areas are placed |
| `fieldsInputFlexDirection`, `fieldsOutputFlexDirection` | `horizontal`, `vertical` | `vertical` | With `flex`: the direction of the input fields, and of the output fields |
| `fieldsInputGridTemplate`, `fieldsOutputGridTemplate` | a CSS `grid-template` | | With `grid`: the fields are named by their `key` |

Only the settings of the chosen type apply: `areaFlexDirection` is ignored
when `areaType` is `grid`, and the same for the fields. `fieldsType` applies
to both areas, so with `grid` set both field templates.

**Flex** shares the space equally. Areas or fields side by side each get the
full height, and stacked ones split it:

```json
"layoutSetting": {
  "areaFlexDirection": "vertical",
  "fieldsInputFlexDirection": "horizontal"
}
```

This puts the input area above the output, each half the height, with the
input fields next to each other. See
[`sample-layout-kit`](sample-layout-kit) for both directions.

**Grid** sizes each row yourself. A template is the CSS `grid-template`
shorthand: quoted rows name the areas, the size after each row sets its
height, and an optional `/ …` after the rows sets the column widths.

```json
"layoutSetting": {
  "areaType": "grid",
  "areaGridTemplate": "'input' min-content 'output' 1fr",
  "fieldsType": "grid",
  "fieldsInputGridTemplate": "'expression' 1fr 'json' 3fr",
  "fieldsOutputGridTemplate": "'result' 1fr"
}
```

The input area sits on top, as tall as its fields need, and the output takes
the rest. In the input area, `expression` gets a quarter of the height and
`json` three quarters. Name every field of an area in its template: a field
left out isn't placed where you expect.

**Sizes to use in a template:**

| Size | Gives the field |
|---|---|
| `1fr`, `2fr`, … | A share of the space left, like flex |
| `min-content` | Only the height its content needs |
| `120px` | A fixed height |

Editors and viewers (`TextArea`, `Code`, `Markdown`, `DataGrid`, …) fill the
place they get and have no height of their own, so give them `fr` rows.
Single-line fields (`Text`, `Select`, `Switch`, `DateTime`, …) and `@`
components fit a `min-content` row. See Components for how an `@` component
is sized.

Batch mode and a maximized field always show the fields side by side,
whatever the layout says.

The extension installs, updates and is enabled as one. Each tool shows up in
Peranti on its own, with the ID `<extension id>/<tool folder>`.

## Components

When no built-in field fits, an extension can draw its own with HTML. Its tools
use it with `"component": "@<component folder>"`, such as `"@hue-wheel"`. A component belongs to its
extension: other extensions can't use it. See
[`sample-color-kit`](sample-color-kit) for an input (a hue wheel)
and an output (a palette strip).

A component has no size setting. The tool's `layoutSetting` sizes it like any
other field (see Screen layout):

- **In flex, or a `fr` row**, it takes the whole place it gets. Its page's
  `html` and `body` are that tall, so the content can fill them with
  `height: 100%` or scroll inside them, as in
  [`sample-layout-kit`](sample-layout-kit).
- **In a `min-content` row**, it's as tall as its content and follows it as
  the content changes, as in `sample-color-kit`'s Harmony tool:

```json
"layoutSetting": {
  "fieldsType": "grid",
  "fieldsInputGridTemplate": "'base' min-content 'scheme' min-content / 1fr",
  "fieldsOutputGridTemplate": "'palette' min-content 'hexes' min-content / 1fr"
}
```

Content that fills its body with `height: 100%` has no height of its own, so
keep it out of `min-content` rows.

```json
{
  "name": "Hue Wheel",
  "kind": "input",
  "entry": "index.html"
}
```

| Field | Required | |
|---|---|---|
| `name` | no | Falls back to the folder name |
| `entry` | yes | HTML file inside the component's folder, such as `index.html` or `dist/index.html`. Must stay inside the folder |
| `kind` | no | `input`, `output` or `both` (default) |
| `value` | no | What its value is, see below. Treated as any JSON when left out |
| `description` | no | |

`value` describes the value for people using the component, and Peranti shows
it in **Manage → Components**:

```json
"value": {
  "type": "object",
  "description": "The picked color: { hue: 0-359, lightness: 15-85 }",
  "example": { "hue": 200, "lightness": 55 }
}
```

`type` is one of `string`, `number`, `boolean`, `json-string` (JSON written as
text), `object`, `array`, `file`, `files`, `any` or `none`. `example` is the starting value on
**Manage → Components** when no tool sets a default.

For an `object` or an `array`, `fields` describes its structure: the keys of
the object, or the keys of each item of the array. Each key takes the same
`name`, `type`, `description`, `required` and `options` as a prop, and the
Components tab checks values against them. An array of plain values sets
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
`"props"` a tool sets on the field. The Components tab lists them, adds
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
| `example` | no | Filled in when the prop is added in the Components tab |

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
| [`sample-react-kit`](sample-react-kit) | React | Vite | JSON tree (output) |
| [`sample-svelte-kit`](sample-svelte-kit) | Svelte | Vite | Star rating (input) |
| [`sample-vue-kit`](sample-vue-kit) | Vue | none | Tag input (input) |
| [`sample-alpine-kit`](sample-alpine-kit) | Alpine.js | none | Checklist (input) |

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
can sit at the root, as in this repo, or inside an `extensions` folder. There
is no index file and no script to run.

In Peranti, open **Settings → Extensions** and add one:

| Source | Enter |
|---|---|
| GitHub, GitLab (including self-hosted), Gitea, Forgejo, Codeberg | The repo URL, plus a branch if it isn't `main` |
| A folder on your computer | Choose the folder. It's linked and runs from where it is |

A folder with a broken `peranti.json` is left out of the list, and the reason
is logged in the developer console.
