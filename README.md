# TurnHebrew  🚧 Work in Progress

A Chrome extension that converts English text to Hebrew by mapping QWERTY keyboard characters to their Hebrew equivalents.

## Overview

TurnHebrew is designed for users who want to quickly convert English text to Hebrew without manually typing in Hebrew. It provides a context menu option that translates selected English text to Hebrew based on a QWERTY-to-Hebrew character mapping.

## Features

- **Context Menu Integration**: Right-click on selected text and choose "toHebrew" to convert
- **Character Mapping**: Converts QWERTY keyboard layout to Hebrew characters
  - Letters: q→/, w→', e→ק, r→ר, t→א, y→ט, u→ו, i→ן, o→ם, p→פ, etc.
  - Numbers and symbols: q→/, .→/
- **Sync Storage**: Converted text is stored in Chrome sync storage and displayed in the extension popup
- **Chrome Notifications**: Supports notification permissions for feedback
- **Clipboard Support**: Can write to clipboard

## Project Structure

```
TurnHebrew/
├── src/
│   ├── manifest.json              # Extension configuration (Manifest V3)
│   ├── eventPage.js              # Main logic for text conversion
│   ├── eventPage-wrapper.js      # Service worker wrapper
│   ├── popup.html                # Popup UI
│   ├── popup.js                  # Popup behavior
│   └── jquery-3.6.0.min.js       # jQuery library
├── package.json                   # NPM dependencies
└── TurnHebrew.iml                # IntelliJ IDE project file
```

## Technical Details

### Manifest Version
- Uses **Manifest V3** (latest Chrome extension API standard)
- Version: **1.1.0**

### Dependencies
- jQuery 3.6.0

### Permissions
- `storage` - For Chrome sync storage
- `notifications` - For notification support
- `contextMenus` - For right-click context menu
- `clipboardWrite` - For clipboard operations

## How It Works

1. **Service Worker** (`eventPage-wrapper.js`): Initializes the extension and loads main logic
2. **Event Handler** (`eventPage.js`): 
   - Creates a "toHebrew" context menu item
   - Listens for context menu clicks
   - Converts selected English text to Hebrew using character mapping
   - Stores result in Chrome sync storage
3. **Popup UI** (`popup.html`/`popup.js`):
   - Displays the last converted Hebrew text

## Development

### Setup
```bash
npm install
```

### Installation in Chrome
1. Go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `src` directory

### Character Mapping Details
The extension uses a QWERTY-to-Hebrew keyboard layout mapping. This allows users who have English keyboards to input Hebrew text as if they were typing on a Hebrew keyboard layout.

## Future Enhancements
- Support for additional keyboard layouts
- Custom mapping configuration
- Clipboard history
- Reverse conversion (Hebrew to English)
- Settings page for user preferences
