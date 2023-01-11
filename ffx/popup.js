const DAYS = 24 * 60 * 60 * 1000;
// Get the tab ID and URL from the query string.
function popup(settings) {
	console.log("loaded popup.js...");
	const START_WARNING_TIME = (parseInt(settings.warnAfter) || 87) * DAYS;
	const list = document.getElementById("tablist")
	browser.tabs.query({}).then((tabs) => {
		tabs.forEach((tab) => {
		const inactiveTime = Date.now() - tab.lastAccessed;
		if (inactiveTime > START_WARNING_TIME) {
			const li = document.createElement("li");
			// Set the text content of the list item
			const d = new Date(tab.lastAccessed);
			// request a weekday along with a long date
			let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
			li.textContent = tab.title + ` (last accessed ${new Intl.DateTimeFormat('en-US',options).format(d)}`;
			// console.log(new Intl.DateTimeFormat(options).format(date));
			// Add the list item to the unordered list.
			list.appendChild(li);
		}
		});
	});
}

function onError(error) {
console.log(`Storage retrieval error: ${error}`);
}

const getting = browser.storage.sync.get(["warnAfter","closeAfter", "notifyDelete", "popupWarning"]);
getting.then( 
	(settings) => { 
		console.debug("promise resolved",settings);
		popup(settings);
	}, onError);