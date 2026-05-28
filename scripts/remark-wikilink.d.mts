// Minimal type — remark plugin function. Avoids dragging unified types into
// vite.config.ts's tsconfig.node.json.
declare const remarkWikilink: () => (tree: unknown) => void
export default remarkWikilink
