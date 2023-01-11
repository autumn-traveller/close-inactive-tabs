function saveOptions(e) {
  e.preventDefault();
  browser.storage.sync.set({
    warnAfter: document.querySelector("#warn").value,
    closeAfter: document.querySelector("#close").value,
    notifyDelete: document.querySelector("#notifyDelete").checked,
    popupWarning: document.querySelector("#popupWarning").checked
  });
}

function restoreOptions() {
  function setCurrentChoice(result) {
    document.querySelector("#warn").value = result.warnAfter || "87";
    document.querySelector("#close").value = result.closeAfter || "90";
    if (result.notifyDelete == undefined || result.notifyDelete == null){
      // default value
      document.querySelector("#notifyDelete").checked = false;
    } else {
      document.querySelector("#notifyDelete").checked = result.notifyDelete; "off";
    }
    if (result.popupWarning == undefined || result.popupWarning == null){
      // default value
      document.querySelector("#popupWarning").checked = true;
    } else {
      document.querySelector("#popupWarning").checked = result.popupWarning;
    }
  }

  function onError(error) {
    console.log(`Storage retrieval error: ${error}`);
  }

  let getting = browser.storage.sync.get(["warnAfter","closeAfter", "notifyDelete", "popupWarning"]);
  getting.then(setCurrentChoice, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
console.debug("Loaded settings json")
