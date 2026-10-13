// Receives the input values, returns one value for every output key.
// Runs in a Web Worker: browser APIs only, no Node (fs, require, process).
export default function action({ text }) {
  return {
    result: text ?? "",
  }
}
