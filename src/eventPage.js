const contextMenuItemH = {
    "id": "toHebrew",
    "title": "toHebrew",
    "contexts": ["selection"]
};
chrome.contextMenus.create(contextMenuItemH);
chrome.contextMenus.onClicked.addListener(function(clickData) {
    if (clickData.menuItemId == "toHebrew" && clickData.selectionText) {
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
        for (let i = 0; i < str.length; i++) {
            let char = str.toLowerCase()[i];
            if (char in dict) {
                new_text += dict[char];
            } else {
                new_text += char;
            }
        }
        chrome.storage.sync.set({'hebrew': new_text}, function() {
            var notifOptionsH = {
                type: 'basic',
                iconUrl: "icon.png",
                title: 'text is here!',
                message: new_text
            };
            chrome.notifications.create("", notifOptionsH, function (){});

        });
    }});

const contextMenuItemE = {
    "id": "toEnglish",
    "title": "toEnglish",
    "contexts": ["selection"]
};
chrome.contextMenus.create(contextMenuItemE);
chrome.contextMenus.onClicked.addListener(function(clickData) {
    if (clickData.menuItemId == "toEnglish" && clickData.selectionText) {
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
            "ץ": ".",
        };
        let new_text = "";
        let str = clickData.selectionText;
        for (let i = 0; i < str.length; i++) {
            let char = str[i];
            if (char in dict) {
                new_text += dict[char];
            } else {
                new_text += char;
            }
        }
        chrome.storage.sync.set({'hebrew': new_text}, function () {
            var notifOptionsE = {
                type: 'basic',
                iconUrl: "icon.png",
                title: 'text is here!',
                message: new_text
            };
            chrome.notifications.create("", notifOptionsE, function () {});
            chrome.notifications.onclick.addListener(function (){
                console.log(notifOptionsE.message);
            })
        })
    }});