/**
 * @file popup.js
 * @description UI logic for the TurnHebrew extension popup.
 *
 * This script runs inside popup.html whenever the user clicks the extension
 * icon in the Chrome toolbar. It is NOT a service worker or content script —
 * it has full access to the popup page's DOM and to the Chrome extension APIs,
 * but it only lives as long as the popup window is open.
 *
 * Responsibility: read the most recently converted text from Chrome sync
 * storage (written there by eventPage.js after a context menu conversion) and
 * display it in the #hebrew <span> element on the popup page.
 *
 * Execution order on popup open:
 *   1. popup.html loads jquery-3.6.0.min.js  → jQuery ($) is available.
 *   2. popup.html loads eventPage.js          → context menus re-registered
 *                                               (service worker already did this).
 *   3. popup.html loads popup.js (this file)  → storage is read, span updated.
 *
 * Dependencies: jQuery 3.6.0 — must be loaded before this script runs.
 */

/**
 * Reads the last converted text from Chrome sync storage and displays it in
 * the popup.
 *
 * chrome.storage.sync.get is asynchronous; the callback fires once Chrome has
 * returned the requested value from sync storage. If the user has never
 * performed a conversion (first run), items.hebrew will be undefined and the
 * #hebrew span will be emptied.
 *
 * @param {Object} items - The object returned by chrome.storage.sync.get,
 *   where items.hebrew is the previously stored converted string, or undefined
 *   if the key has never been set.
 * @returns {void}
 * @sideeffects
 *   - Updates the text content of the DOM element with id="hebrew" via jQuery.
 */
chrome.storage.sync.get('hebrew', function (items) {
    // Use jQuery to find the <span id="hebrew"> and set its visible text to
    // the stored converted string. If items.hebrew is undefined, .text()
    // renders an empty string, leaving the span blank.
    $('#hebrew').text(items.hebrew);
});
