// src/services/aiService.ts
/**
 * AI Service Abstraction Layer (Plug-and-Play)
 * 
 * This file acts as the single entry point for all AI-related functionality in the application.
 * It allows swapping the entire AI backend by changing the `ACTIVE_SERVICE_STACK` variable.
 * The UI components are completely decoupled from the specific implementation details of the AI service.
 *
 * Integration secrets and endpoints are centralized in `src/services/runtime/integrationConfig.ts`.
 */

// --- Configuration ---
// Change this variable to switch between different AI service stacks.
// 'google': Uses the full-power Google Gemini model (escalation layer).
// 'cloudflare': Placeholder for Cloudflare Workers AI.
// 'tinyml': Implements the full 7-layer security-first architecture with local/edge models.
// FIX: Using a const with a type assertion to prevent TypeScript from narrowing the type of ACTIVE_SERVICE_STACK to a single literal value. This ensures the switch statement and other checks can correctly evaluate all possible cases.
const ACTIVE_SERVICE_STACK = 'chattia7' as 'google' | 'cloudflare' | 'tinyml' | 'chattia7';

// --- Service Imports ---
import * as GoogleService from './google';
import * as CloudflareService from './cloudflare';
import * as TinyMLService from './efficiency/tinyml';
import * as Chattia7Service from './chattia';
import type { ChatMessage, AIProgress } from '../types';

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