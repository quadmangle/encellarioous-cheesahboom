// Copy this file to `runtime-config.js` and populate the keys that you want to
// expose to the front-end at runtime. The Google Gemini fallback requires an
// API key to be set before the bundle runs.
//
// Example:
//   window.__OPS_RUNTIME_ENV__ = {
//     GEMINI_API_KEY: 'your-key-here'
//   };
//
// Never commit secrets to source control. The `.gitignore` in this folder keeps
// `runtime-config.js` out of git by default.
window.__OPS_RUNTIME_ENV__ = window.__OPS_RUNTIME_ENV__ || {};
