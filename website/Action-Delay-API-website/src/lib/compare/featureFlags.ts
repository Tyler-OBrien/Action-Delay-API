// Single switch for the AI-assisted parts of /compare — the natural-language
// query box and the "Explain these results" summary. Everything else (presets,
// the manual builder, /api/compare itself) is unaffected.
//
// Flip this off rather than deleting the routes/UI when the underlying model
// is misbehaving: the API routes short-circuit before calling the AI binding
// (no cost, no exposure while it's off) and the UI hides the entry points.
export const AI_COMPARE_ENABLED = false;
