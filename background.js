chrome.commands.onCommand.addListener(function(command) {
  if (command === "toggle-feature") {
    // الكود الخاص بك لفتح أو إغلاق نافذة الملاحظات
    chrome.action.openPopup();
  }
});
