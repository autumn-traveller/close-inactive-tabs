// Get the tab ID and URL from the query string.
const params = new URLSearchParams(location.search);
const id = decodeURIComponent(params.get("id"));
const url = decodeURIComponent(params.get("url"));
const days = decodeURIComponent(params.get("days"));
const closes = decodeURIComponent(params.get("closes"));
// Update the page with the tab ID and URL.
document.getElementById("tabname").textContent = id;
document.getElementById("days").textContent = days;
document.getElementById("closed").textContent = closes - days;
const urlComp = document.getElementById("url")
urlComp.textContent = url;
urlComp.link = url;
