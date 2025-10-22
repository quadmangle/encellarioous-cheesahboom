// src/services/aiService.ts
/**
 * AI Service Abstraction Layer (Plug-and-Play)
 * 
 * This file acts as the single entry point for all AI-related functionality in the application.
 * It allows swapping the entire AI backend by changing the `ACTIVE_SERVICE_STACK` variable.
 * The UI components are completely decoupled from the specific implementation details of the AI service.
 */

// --- Service Imports ---
import { resolveActiveServiceStack } from './runtimeGlobals';
import * as GoogleService from './google';
import * as CloudflareService from './cloudflare';
import * as TinyMLService from './efficiency/tinyml';
import * as Chattia7Service from './chattia';
import type { ChatMessage, AIProgress } from '../types';

// --- Configuration ---
// The active stack is resolved at runtime and can be overridden through the global bridge in index.html.
// Valid values include:
//   • 'google'     – Escalates to Google Gemini via API key.
//   • 'cloudflare' – Routes through a Workers AI proxy endpoint.
//   • 'tinyml'     – Uses the local/edge TinyML stack shipped with the app.
//   • 'chattia7'   – Default layered experience with OPS guardrails.
// The helper keeps the TypeScript source and the preloaded script tags in sync.
const ACTIVE_SERVICE_STACK = resolveActiveServiceStack();

// --- Common Interface Definition ---
export interface AIService {
  streamChatResponse: (
    history: ChatMessage[],
    newMessage: string,
    onChunk: (chunk: string) => void,
    // Add an optional onProgress callback for services that need it (like WebLLM).
    onProgress?: (progress: AIProgress) => void
  ) => Promise<void>;
  resetChat: () => void;
  // NOTE: Real-time audio chat could be added to this interface as well.
}

// --- Service Selection Logic ---
let selectedService: AIService;

switch (ACTIVE_SERVICE_STACK) {
  case 'tinyml':
    selectedService = TinyMLService;
    break;
  case 'cloudflare':
    selectedService = CloudflareService;
    break;
  case 'chattia7':
    selectedService = Chattia7Service;
    break;
  case 'google':
  default:
    selectedService = GoogleService;
    break;
}

// --- Exported Functions ---
// The UI will call these functions, which are dynamically pointing to the active service stack.

export const streamChatResponse = selectedService.streamChatResponse;
export const resetChat = selectedService.resetChat;
export const ACTIVE_STACK = ACTIVE_SERVICE_STACK;
