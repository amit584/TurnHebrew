/**
 * @file eventPage.js
 * @description Core conversion logic for the TurnHebrew Chrome extension.
 *
 * This file executes in two distinct contexts:
 *   1. Service worker — loaded via importScripts() in eventPage-wrapper.js.
 *      This is the long-running background process that listens for context
 *      menu clicks while the browser is open.
 *   2. Extension popup — loaded directly by a <script> tag in popup.html.
 *      When the popup opens, this file re-runs and attempts to register the
 *      same context menus and listeners again (which may log duplicate-ID
 *      errors in the popup console, but does not affect functionality).
 *
 * Responsibilities:
 *   - Registers two right-click context menu items: "toHebrew" and "toEnglish".
 *   - On "toHebrew" click: converts selected English (QWERTY-layout) text to
 *     Hebrew characters and saves the result to Chrome sync storage.
 *   - On "toEnglish" click: converts selected Hebrew characters back to English
 *     (QWERTY-layout) equivalents and saves the result to Chrome sync storage.
 *   - After each conversion, fires a Chrome desktop notification showing the
 *     converted text.
 *
 * Data flow:
 *   User selects text → right-clicks → chooses menu item
 *     → listener fires → text converted char-by-char
 *     → result written to chrome.storage.sync['hebrew']
 *     → desktop notification shown
 *     → popup.js reads storage and displays result in the popup UI
 */

// ---------------------------------------------------------------------------
// "toHebrew" context menu — English (QWERTY) → Hebrew
// ---------------------------------------------------------------------------

/**
 * Configuration object for the "toHebrew" context menu item.
 * "contexts: ['selection']" means the item only appears when the user has
 * highlighted text before right-clicking.
 *
 * @type {chrome.contextMenus.CreateProperties}
 */
const contextMenuItemH = {
    "id": "toHebrew",       // unique ID used to identify which item was clicked
    "title": "toHebrew",    // label shown in the right-click menu
    "contexts": ["selection"] // only visible when text is selected
};

// Register the "toHebrew" menu item with Chrome. This runs once when the
// service worker starts (or when popup.html loads this file).
chrome.contextMenus.create(contextMenuItemH);

/**
 * Listener for all context menu clicks. Filters to only act when the
 * "toHebrew" item was clicked and there is actually selected text.
 *
 * Converts the selected English text to Hebrew using a QWERTY-to-Hebrew
 * character map, stores the result in Chrome sync storage, then fires a
 * desktop notification displaying the converted text.
 *
 * @param {chrome.contextMenus.OnClickData} clickData - Data about the click
 *   event. Relevant fields:
 *     - clickData.menuItemId {string} — the "id" of the menu item clicked.
 *     - clickData.selectionText {string} — the text the user had selected.
 * @returns {void}
 * @sideeffects
 *   - Writes the converted string to chrome.storage.sync under key 'hebrew'.
 *   - Creates a Chrome desktop notification via chrome.notifications.create.
 */
chrome.contextMenus.onClicked.addListener(function(clickData) {
    if (clickData.menuItemId == "toHebrew" && clickData.selectionText) {

        /**
         * QWERTY-to-Hebrew character map.
         *
         * Each key is a lowercase English letter (or punctuation) as it appears
         * on a standard US QWERTY keyboard. The value is the Hebrew character
         * that occupies the same physical key on an Israeli Hebrew keyboard layout.
         *
         * This is what lets a user type phonetically using their English keyboard
         * as if it were a Hebrew keyboard:
         *
         *   Top row:  q→/  w→'  e→ק  r→ר  t→א  y→ט  u→ו  i→ן  o→ם  p→פ
         *   Home row: a→ש  s→ד  d→ג  f→כ  g→ע  h→י  j→ח  k→ל  l→ך  ;→ף
         *   Bottom:   z→ז  x→ס  c→ב  v→ה  b→נ  n→מ  m→צ  ,→ת  .→/
         *
         * Characters not present in this map (digits, spaces, most punctuation)
         * are passed through to the output unchanged.
         *
         * @type {Object.<string, string>}
         */
        const dict = {
            "q": "/",
            "w": "'",
            "e": "ק",
            "r": "ר",
            "t": "א",
            "y": "ט",
            "u": "ו",
            "i": "ן",
            "o": "ם",
            "p": "פ",
            "a": "ש",
            "s": "ד",
            "d": "ג",
            "f": "כ",
            "g": "ע",
            "h": "י",
            "j": "ח",
            "k": "ל",
            "l": "ך",
            ";": "ף",
            "z": "ז",
            "x": "ס",
            "c": "ב",
            "v": "ה",
            "b": "נ",
            "n": "מ",
            "m": "צ",
            ",": "ת",
            ".": "/"
        };

        let new_text = "";
        let str = clickData.selectionText;

        // Walk through every character in the selected text one at a time.
        for (let i = 0; i < str.length; i++) {
            // Lowercase before lookup so uppercase letters (e.g. "E") map the
            // same as their lowercase counterparts ("e" → ק). Hebrew has no
            // concept of letter case, so this is always safe.
            let char = str.toLowerCase()[i];

            if (char in dict) {
                // Character has a Hebrew equivalent — use it.
                new_text += dict[char];
            } else {
                // Character is not in the map (e.g. digit, space, emoji) —
                // keep it unchanged so the output stays readable.
                new_text += char;
            }
        }

        // Persist the converted text so popup.js can read it when the popup
        // opens. The key 'hebrew' is also used by the "toEnglish" direction —
        // both conversions share the same storage slot.
        chrome.storage.sync.set({'hebrew': new_text}, function() {
            // Build the notification payload shown after conversion succeeds.
            var notifOptionsH = {
                type: 'basic',
                iconUrl: "icon.png",   // extension icon shown in the notification
                title: 'text is here!',
                message: new_text      // the converted Hebrew string
            };

            // Fire a desktop notification. The empty string "" as the first
            // argument lets Chrome auto-generate a notification ID.
            chrome.notifications.create("", notifOptionsH, function (){});
        });
    }
});

// ---------------------------------------------------------------------------
// "toEnglish" context menu — Hebrew → English (QWERTY)
// ---------------------------------------------------------------------------

/**
 * Configuration object for the "toEnglish" context menu item.
 * Mirrors contextMenuItemH but operates in the reverse direction.
 *
 * @type {chrome.contextMenus.CreateProperties}
 */
const contextMenuItemE = {
    "id": "toEnglish",        // unique ID used to identify which item was clicked
    "title": "toEnglish",     // label shown in the right-click menu
    "contexts": ["selection"] // only visible when text is selected
};

// Register the "toEnglish" menu item with Chrome.
chrome.contextMenus.create(contextMenuItemE);

/**
 * Listener for all context menu clicks. Filters to only act when the
 * "toEnglish" item was clicked and there is actually selected text.
 *
 * Converts selected Hebrew characters to their English (QWERTY) equivalents
 * using a Hebrew-to-QWERTY character map, stores the result in Chrome sync
 * storage, then fires a desktop notification displaying the result.
 *
 * Note: unlike the "toHebrew" direction, this listener does NOT lowercase
 * the input before lookup. Hebrew characters have no case, so lowercasing
 * is unnecessary.
 *
 * @param {chrome.contextMenus.OnClickData} clickData - Data about the click
 *   event. Relevant fields:
 *     - clickData.menuItemId {string} — the "id" of the menu item clicked.
 *     - clickData.selectionText {string} — the text the user had selected.
 * @returns {void}
 * @sideeffects
 *   - Writes the converted string to chrome.storage.sync under key 'hebrew'.
 *   - Creates a Chrome desktop notification via chrome.notifications.create.
 *   - Registers a chrome.notifications.onclick listener on every invocation
 *     (note: this accumulates listeners across repeated uses).
 */
chrome.contextMenus.onClicked.addListener(function(clickData) {
    if (clickData.menuItemId == "toEnglish" && clickData.selectionText) {

        /**
         * Hebrew-to-QWERTY character map — the inverse of the "toHebrew" dict.
         *
         * Each key is a Hebrew character; the value is the corresponding key on
         * a standard US QWERTY keyboard (matching the Israeli Hebrew layout).
         *
         * @type {Object.<string, string>}
         */
        const dict = {
            "/": "q",
            "'": "w",
            "ק": "e",
            "ר": "r",
            "א": "t",
            "ט": "y",
            "ו": "u",
            "ן": "i",
            "ם": "o",
            "פ": "p",
            "ש": "a",
            "ד": "s",
            "ג": "d",
            "כ": "f",
            "ע": "g",
            "י": "h",
            "ח": "j",
            "ל": "k",
            "ך": "l",
            "ף": ";",
            "ז": "z",
            "ס": "x",
            "ב": "c",
            "ה": "v",
            "נ": "b",
            "מ": "n",
            "צ": "m",
            "ת": ",",
            "ץ": ".",  // final tsadi — mapped to "." (not present in toHebrew dict)
        };

        let new_text = "";
        let str = clickData.selectionText;

        // Walk through every character in the selected Hebrew text one at a time.
        for (let i = 0; i < str.length; i++) {
            let char = str[i]; // no toLowerCase() needed — Hebrew has no case

            if (char in dict) {
                // Character has an English equivalent — use it.
                new_text += dict[char];
            } else {
                // Character is not in the map — pass it through unchanged.
                new_text += char;
            }
        }

        // Persist the result under the same 'hebrew' key used by popup.js.
        chrome.storage.sync.set({'hebrew': new_text}, function () {
            var notifOptionsE = {
                type: 'basic',
                iconUrl: "icon.png",
                title: 'text is here!',
                message: new_text
            };

            // Fire a desktop notification showing the converted text.
            chrome.notifications.create("", notifOptionsE, function () {});

            // Log the converted text to the console when the notification is
            // clicked. Note: this listener is registered inside a callback that
            // runs on every conversion, so repeated use accumulates listeners.
            chrome.notifications.onclick.addListener(function (){
                console.log(notifOptionsE.message);
            })
        })
    }
});
