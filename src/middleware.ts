// Next.js requires the middleware entry point to be named middleware.ts.
// All routing logic lives in src/proxy.ts — this file just re-exports it.
export { proxy as middleware, config } from './proxy'
