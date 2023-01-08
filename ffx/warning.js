// Get the tab ID and URL from the query string.
const params = new URLSearchParams(location.search);
const id = decodeURIComponent(params.get("id"));
const url = decodeURIComponent(params.get("url"));
// Update the page with the tab ID and URL.
document.getElementById("id").textContent = id;
const urlComp = document.getElementById("url")
urlComp.textContent = url;
urlComp.link = url;
