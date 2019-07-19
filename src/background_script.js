// Put all the javascript code here, that you want to execute in background.
chrome.browserAction.onClicked.addListener(() => {
  chrome.tabs.create({ url: 'index.html' });
});