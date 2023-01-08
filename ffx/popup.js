const DAYS = 24 * 60 * 60 * 1000;
const START_WARNING_TIME = 80 * DAYS;
// Get the tab ID and URL from the query string.
console.log("loaded popup.js...");
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

