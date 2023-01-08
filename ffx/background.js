const DAYS = 24 * 60 * 60 * 1000;

// Set the maximum inactive time to 90 days in milliseconds.
const MAX_INACTIVE_TIME = 90 * DAYS;

// Set a warning 2 days before closing the tab
//const START_WARNING_TIME 87 * DAYS;
const START_WARNING_TIME = 80 * DAYS;

// Check the tabs every hour.
const CHECK_INTERVAL = 60 * 60 * 1000;

// Closes a tab if it has been inactive for more than the maximum inactive time.
function closeInactiveTab(tab) {
  inactiveTime = Date.now() - tab.lastAccessed;
  //console.log(tab.title,new Date(tab.lastAccessed),`inactive for ${Math.round(inactiveTime / DAYS)} days`);
  if (inactiveTime > MAX_INACTIVE_TIME) {
    browser.tabs.remove(tab.id);
    browser.notifications.create({
      "type": "basic",
      "iconUrl": browser.extension.getURL("warning.png"),
      "title": "Inactive tab warning",
      "message": `Tab ${tab.title} was removed (${tab.url}) due to being inactive for 90 days`
    });
  }
  if (inactiveTime > START_WARNING_TIME) {
    message = `The ${tab.title} tab (at ${tab.url}) has been inactive for ${Math.round(inactiveTime / DAYS)} days and will be closed in 2 days.`;
	console.log(message);
    browser.notifications.create({
      "type": "basic",
      "iconUrl": browser.extension.getURL("warning.png"),
      "title": "Inactive tab warning",
      "message": message
    });
    if (true || inactiveTime - START_WARNING_TIME < 2 * 60 * 60 * 1000) {
      url = browser.extension.getURL("warning.html") + `?id=${encodeURIComponent(tab.title)}&url=${encodeURIComponent(tab.url)}`;
      browser.windows.create({
        "url": url,
          "type": "popup",
          "width": 500,
          "height": 400
      });
    }
  }
}

// Closes all inactive tabs in the current window.
function closeInactiveTabs() {
  //browser.tabs.query({ currentWindow: true }).then((tabs) => {
  //console.log("Inactive Tabs extension starting up")
  browser.tabs.query({}).then((tabs) => {
    tabs.forEach(closeInactiveTab);
  });
}

// Run the function initially and then every CHECK_INTERVAL milliseconds.
closeInactiveTabs();
setInterval(closeInactiveTabs, CHECK_INTERVAL);
