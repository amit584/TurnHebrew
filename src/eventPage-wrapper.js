/**
 * @file eventPage-wrapper.js
 * @description Service worker entry point for the TurnHebrew Chrome extension.
 *
 * Chrome Manifest V3 requires extensions to declare a service worker as their
 * background script (via "background.service_worker" in manifest.json) instead
 * of the persistent background pages used in Manifest V2. Unlike a background
 * page, a service worker cannot load additional scripts with <script> tags —
 * it must use the synchronous importScripts() function instead.
 *
 * This file's sole job is to pull eventPage.js into the service worker's global
 * scope so that its context menu registrations and click listeners are active
 * whenever the service worker is running.
 *
 * The try/catch wrapper ensures that if eventPage.js fails to load (e.g. due to
 * a syntax error or a missing file), the error is surfaced in the service worker
 * DevTools console rather than silently crashing the worker with no feedback.
 *
 * Execution context: Chrome service worker (background thread, no DOM access).
 * Lifetime: spun up on browser events (context menu click, install, etc.) and
 * terminated by Chrome when idle.
 */

try {
    // Load the core conversion logic into this service worker's global scope.
    // After this call succeeds, all code in eventPage.js has executed: context
    // menu items are registered and onClicked listeners are attached.
    importScripts("eventPage.js");
} catch (e) {
    // Log any load or parse error so it is visible in chrome://serviceworker-internals
    // or the extension's background DevTools panel.
    console.error(e);
}
