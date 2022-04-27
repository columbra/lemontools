/**
 * @fileoverview Adds types for the environment variables.
 * @since v3.0.0
 */

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BOT_TOKEN: string;
    }
  }
}

export {};
