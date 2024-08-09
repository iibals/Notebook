chrome.commands.onCommand.addListener(function(command) {
  if (command === "toggle-feature") {
    // هنا يمكنك وضع الكود الذي تريد تشغيله عند الضغط على الاختصار
    console.log("The notes popup should appear now!");
    chrome.action.openPopup();
  }
});
