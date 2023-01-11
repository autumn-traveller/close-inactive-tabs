const debug = false;

const HOURS = 60 * 60 * 1000;
const DAYS = 24 * HOURS;

// Check the tabs every 4 hours.
const CHECK_INTERVAL = 4 * HOURS;

// Closes a tab if it has been inactive for more than the maximum inactive time.
function closeInactiveTab(tab, settings) {
  const MAX_INACTIVE_TIME = (parseInt(settings.closeAfter) || 90) * DAYS;
  const START_WARNING_TIME = (parseInt(settings.warnAfter) || 87) * DAYS;
  //console.debug("settings:",settings,MAX_INACTIVE_TIME,START_WARNING_TIME);
  inactiveTime = Date.now() - tab.lastAccessed;
  if (inactiveTime > MAX_INACTIVE_TIME) {
    browser.tabs.remove(tab.id);
	if (settings.notifyDelete) {
    browser.notifications.create({
      "type": "basic",
      "iconUrl": browser.runtime.getURL("warning.png"),
      "title": "Inactive tab warning",
      "message": `Tab ${tab.title} was removed (${tab.url}) due to being inactive for 90 days`
      });
    }
  }
  if (inactiveTime > START_WARNING_TIME) {
    message = `The ${tab.title} tab (at ${tab.url}) has been inactive for ${Math.round(inactiveTime / DAYS)} days and will be closed in 2 days.`;
	console.log(message);
    browser.notifications.create({
      "type": "basic",
      "iconUrl": browser.runtime.getURL("warning.png"),
      "title": "Inactive tab warning",
      "message": message
    });
    
    if (debug || (settings.popupWarning && inactiveTime - START_WARNING_TIME < 7.5 * 60 * 60 * 1000)) {
      url = browser.runtime.getURL("warning.html") + `?id=${encodeURIComponent(tab.title)}&url=${encodeURIComponent(tab.url)}&days=${encodeURIComponent(Math.round(inactiveTime / DAYS))}&closes=${encodeURIComponent(Math.round(MAX_INACTIVE_TIME / DAYS))}`;
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
  browser.tabs.query({}).then((tabs) => {

  function onError(error) {
    console.log(`Storage retrieval error: ${error}`);
  }
  const getting = browser.storage.sync.get(["warnAfter","closeAfter", "notifyDelete", "popupWarning"]);
	// console.debug(getting);
	getting.then( 
		(settings) => { 
			// console.debug("promise resolved",settings);
			tabs.forEach((tab) => { closeInactiveTab(tab, settings) }) 
		}
	, onError);
  });
}

// Run the function initially and then every CHECK_INTERVAL milliseconds.
closeInactiveTabs();
setInterval(closeInactiveTabs, CHECK_INTERVAL);
