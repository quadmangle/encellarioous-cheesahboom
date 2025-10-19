// services/tinyml/config.ts
/**
 * Layer Control Panel for the TinyML Service Stack
 *
 * This file allows you to switch the underlying technology for each
 * layer of the on-device AI model with a single line change.
 * This enables easy testing, development, and modular upgrades.
 */

// --- Layer 4: TinyML Provider ---
// 'tensorflow': Uses the live TensorFlow.js toxicity model for on-device analysis.
// 'placeholder': A dummy implementation that does no analysis and always returns a safe result.
export const ACTIVE_TINYML_PROVIDER = 'tensorflow' as 'tensorflow' | 'placeholder';


// --- Layer 5: TinyLLM Provider ---
// 'webllm': Uses the live, in-browser WebLLM engine (Gemma-2b) for generative responses.
// 'placeholder': A dummy implementation that returns a simple, static, non-generative response.
export const ACTIVE_TINYLLM_PROVIDER = 'webllm' as 'webllm' | 'placeholder';

// --- Layer 6: TinyAI Provider ---
// (Future) You could add providers here like 'agentic_placeholder', 'custom_logic_v1', etc.
export const ACTIVE_TINYAI_PROVIDER = 'placeholder' as 'placeholder';
