chrome.storage.sync.get('hebrew',function (items) {
    $('#hebrew').text(items.hebrew);
});